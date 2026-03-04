<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $gbpConfigured = $this->isBusinessProfileConfigured();

        if ($gbpConfigured) {
            $gbpCacheMinutes = max(1, (int) config('services.google_business.cache_minutes', 30));
            $gbpCacheKey = 'google_business_reviews:'.md5((string) $this->businessLocationName());

            $gbpPayload = Cache::remember($gbpCacheKey, now()->addMinutes($gbpCacheMinutes), function () {
                return $this->fetchFromBusinessProfile();
            });

            if (($gbpPayload['api_status'] ?? null) === 'OK') {
                return response()->json($gbpPayload);
            }
        }

        $apiKey = (string) config('services.google_places.api_key');
        $placeId = (string) config('services.google_places.place_id');

        if ($apiKey === '' || $placeId === '') {
            return response()->json([
                'configured' => false,
                'api_status' => 'NOT_CONFIGURED',
                'api_error' => null,
                'name' => null,
                'rating' => null,
                'user_ratings_total' => null,
                'maps_url' => null,
                'reviews' => [],
            ]);
        }

        $cacheMinutes = max(1, (int) config('services.google_places.cache_minutes', 30));
        $cacheKey = "google_places_reviews:{$placeId}";

        $payload = Cache::remember($cacheKey, now()->addMinutes($cacheMinutes), function () use ($apiKey, $placeId) {
            try {
                $response = Http::timeout(10)
                    ->retry(1, 200)
                    ->withHeaders([
                        'X-Goog-Api-Key' => $apiKey,
                        'X-Goog-FieldMask' => 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
                    ])
                    ->get("https://places.googleapis.com/v1/places/{$placeId}");

                if (! $response->ok()) {
                    return [
                        'configured' => true,
                        'api_status' => 'HTTP_'.$response->status(),
                        'api_error' => null,
                        'name' => null,
                        'rating' => null,
                        'user_ratings_total' => null,
                        'maps_url' => null,
                        'reviews' => [],
                    ];
                }

                $json = $response->json();

                if (! is_array($json) || isset($json['error'])) {
                    $status = (string) ($json['error']['status'] ?? 'UNKNOWN');
                    $message = $json['error']['message'] ?? null;

                    return [
                        'configured' => true,
                        'api_status' => $status !== '' ? $status : 'UNKNOWN',
                        'api_error' => $message,
                        'name' => null,
                        'rating' => null,
                        'user_ratings_total' => null,
                        'maps_url' => null,
                        'reviews' => [],
                    ];
                }

                $reviews = collect($json['reviews'] ?? [])
                    ->take(20)
                    ->map(function ($review) {
                        return [
                            'author_name' => $review['authorAttribution']['displayName'] ?? 'Google user',
                            'author_url' => $review['authorAttribution']['uri'] ?? null,
                            'profile_photo_url' => $review['authorAttribution']['photoUri'] ?? null,
                            'rating' => (int) ($review['rating'] ?? 0),
                            'text' => $review['text']['text'] ?? '',
                            'relative_time_description' => $review['relativePublishTimeDescription'] ?? '',
                            'time' => $review['publishTime'] ?? null,
                        ];
                    })
                    ->values()
                    ->all();

                return [
                    'configured' => true,
                    'api_status' => 'OK',
                    'api_error' => null,
                    'name' => $json['displayName']['text'] ?? null,
                    'rating' => isset($json['rating']) ? (float) $json['rating'] : null,
                    'user_ratings_total' => isset($json['userRatingCount']) ? (int) $json['userRatingCount'] : null,
                    'maps_url' => $json['googleMapsUri'] ?? null,
                    'reviews' => $reviews,
                ];
            } catch (\Throwable $e) {
                Log::warning('Google reviews fetch failed', ['message' => $e->getMessage()]);

                return [
                    'configured' => true,
                    'api_status' => 'EXCEPTION',
                    'api_error' => 'Unable to fetch Google reviews',
                    'name' => null,
                    'rating' => null,
                    'user_ratings_total' => null,
                    'maps_url' => null,
                    'reviews' => [],
                ];
            }
        });

        return response()->json($payload);
    }

    private function isBusinessProfileConfigured(): bool
    {
        return (string) config('services.google_business.client_id') !== ''
            && (string) config('services.google_business.client_secret') !== ''
            && (string) config('services.google_business.refresh_token') !== ''
            && $this->businessLocationName() !== '';
    }

    private function businessLocationName(): string
    {
        $fullName = (string) config('services.google_business.location_name');
        if ($fullName !== '') {
            return $fullName;
        }

        $accountId = (string) config('services.google_business.account_id');
        $locationId = (string) config('services.google_business.location_id');

        if ($accountId !== '' && $locationId !== '') {
            return "accounts/{$accountId}/locations/{$locationId}";
        }

        return '';
    }

    private function fetchFromBusinessProfile(): array
    {
        try {
            $locationName = $this->businessLocationName();
            if ($locationName === '') {
                return $this->emptyResponse('NOT_CONFIGURED', null, true);
            }

            $tokenResp = Http::asForm()
                ->timeout(12)
                ->retry(1, 200)
                ->post('https://oauth2.googleapis.com/token', [
                    'client_id' => (string) config('services.google_business.client_id'),
                    'client_secret' => (string) config('services.google_business.client_secret'),
                    'refresh_token' => (string) config('services.google_business.refresh_token'),
                    'grant_type' => 'refresh_token',
                ]);

            if (! $tokenResp->ok()) {
                return $this->emptyResponse('OAUTH_FAILED', 'Failed to get Google OAuth token', true);
            }

            $tokenJson = $tokenResp->json();
            $accessToken = $tokenJson['access_token'] ?? null;

            if (! is_string($accessToken) || $accessToken === '') {
                return $this->emptyResponse('OAUTH_TOKEN_MISSING', 'Google OAuth token missing', true);
            }

            $allReviews = collect();
            $pageToken = null;
            $loops = 0;

            do {
                $query = [
                    'pageSize' => 50,
                    'orderBy' => 'updateTime desc',
                ];

                if ($pageToken) {
                    $query['pageToken'] = $pageToken;
                }

                $reviewResp = Http::timeout(15)
                    ->retry(1, 200)
                    ->withToken($accessToken)
                    ->get("https://mybusiness.googleapis.com/v4/{$locationName}/reviews", $query);

                if (! $reviewResp->ok()) {
                    return $this->emptyResponse('GBP_HTTP_'.$reviewResp->status(), 'Failed fetching Google Business Profile reviews', true);
                }

                $reviewJson = $reviewResp->json();
                $allReviews = $allReviews->merge($reviewJson['reviews'] ?? []);
                $pageToken = $reviewJson['nextPageToken'] ?? null;
                $loops++;
            } while ($pageToken && $loops < 10);

            $mapped = $allReviews->map(function ($review) {
                $rating = match ($review['starRating'] ?? null) {
                    'ONE' => 1,
                    'TWO' => 2,
                    'THREE' => 3,
                    'FOUR' => 4,
                    'FIVE' => 5,
                    default => 0,
                };

                $updatedTime = $review['updateTime'] ?? null;
                $relative = '';

                if (is_string($updatedTime) && $updatedTime !== '') {
                    try {
                        $relative = Carbon::parse($updatedTime)->diffForHumans();
                    } catch (\Throwable) {
                        $relative = '';
                    }
                }

                return [
                    'author_name' => $review['reviewer']['displayName'] ?? 'Google user',
                    'author_url' => null,
                    'profile_photo_url' => $review['reviewer']['profilePhotoUrl'] ?? null,
                    'rating' => $rating,
                    'text' => $review['comment'] ?? '',
                    'relative_time_description' => $relative,
                    'time' => $updatedTime,
                ];
            })->values();

            $rating = null;
            if ($mapped->count() > 0) {
                $rating = round($mapped->avg('rating'), 1);
            }

            return [
                'configured' => true,
                'api_status' => 'OK',
                'api_error' => null,
                'source' => 'google_business_profile',
                'name' => (string) config('services.google_business.display_name', 'Google Business Profile'),
                'rating' => $rating,
                'user_ratings_total' => $mapped->count(),
                'maps_url' => (string) config('services.google_business.maps_url') ?: null,
                'reviews' => $mapped->all(),
            ];
        } catch (\Throwable $e) {
            Log::warning('Google Business Profile reviews fetch failed', ['message' => $e->getMessage()]);

            return $this->emptyResponse('EXCEPTION', 'Unable to fetch Google Business Profile reviews', true);
        }
    }

    private function emptyResponse(string $status, ?string $error, bool $configured): array
    {
        return [
            'configured' => $configured,
            'api_status' => $status,
            'api_error' => $error,
            'name' => null,
            'rating' => null,
            'user_ratings_total' => null,
            'maps_url' => null,
            'reviews' => [],
        ];
    }
}
