<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'min:2', 'max:50'],
            'last_name'  => ['required', 'string', 'min:2', 'max:50'],
            'email'      => ['required', 'email', 'max:100'],
            'subject'    => ['required', 'in:general,support,billing,partnership,other'],
            'message'    => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Please enter your first name.',
            'last_name.required'  => 'Please enter your last name.',
            'email.required'      => 'Please enter a valid email address.',
            'email.email'         => 'The email address format is invalid.',
            'subject.required'    => 'Please select a subject.',
            'subject.in'          => 'Please select a valid subject.',
            'message.required'    => 'Please enter your message.',
            'message.min'         => 'Your message must be at least 10 characters.',
        ];
    }
}
