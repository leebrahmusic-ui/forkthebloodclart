<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuoteCheckoutRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'service' => ['required'], // accept key/value or string
            'form' => ['required', 'array'],
            'amount' => ['required'],
            'coupon_code' => ['nullable', 'string', 'max:80'],
            'embedded' => ['nullable', 'boolean'],
            'payment_element' => ['nullable', 'boolean'],
        ];
    }
}
