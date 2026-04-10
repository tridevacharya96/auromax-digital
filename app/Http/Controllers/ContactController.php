<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Send email notification (configure MAIL_* in .env)
        // Mail::to(config('mail.contact_to', 'hello@auromax.digital'))
        //     ->send(new ContactMail($data));

        // Log for now (remove in production)
        \Log::info('Contact form submission', $data);

        return response()->json([
            'message' => 'Your message has been received. We\'ll get back to you within 24 hours.',
        ], 201);
    }
}
