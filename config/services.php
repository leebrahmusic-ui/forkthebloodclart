<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'forms' => [
        [
            'key' => 'boiler_repair',
            'value' => 'Boiler Repair',
        ],
        [
            'key' => 'boiler_service',
            'value' => 'Boiler Service',
        ],
        [
            'key' => 'new_boiler_quote',
            'value' => 'New Boiler Quote',
        ],
        [
            'key' => 'power_flush',
            'value' => 'Power Flush',
        ]
    ],

    'currency' => [
        'code'   => env('PAYMENT_CURRENCY', 'GBP'),
        'symbol' => env('PAYMENT_CURRENCY_SYMBOL', '£'),
    ],
    'stripe' => [
        'secret' => env('STRIPE_SECRET'),
        'api'   => env('STRIPE_KEY')
    ],

    'google_places' => [
        'api_key' => env('GOOGLE_PLACES_API_KEY'),
        'place_id' => env('GOOGLE_PLACES_PLACE_ID'),
        'cache_minutes' => env('GOOGLE_PLACES_CACHE_MINUTES', 30),
    ],

    'google_business' => [
        'client_id' => env('GOOGLE_BUSINESS_CLIENT_ID'),
        'client_secret' => env('GOOGLE_BUSINESS_CLIENT_SECRET'),
        'refresh_token' => env('GOOGLE_BUSINESS_REFRESH_TOKEN'),
        'location_name' => env('GOOGLE_BUSINESS_LOCATION_NAME'),
        'account_id' => env('GOOGLE_BUSINESS_ACCOUNT_ID'),
        'location_id' => env('GOOGLE_BUSINESS_LOCATION_ID'),
        'display_name' => env('GOOGLE_BUSINESS_DISPLAY_NAME', 'MD Gas Leeds'),
        'maps_url' => env('GOOGLE_BUSINESS_MAPS_URL'),
        'cache_minutes' => env('GOOGLE_BUSINESS_CACHE_MINUTES', 30),
    ],


];
