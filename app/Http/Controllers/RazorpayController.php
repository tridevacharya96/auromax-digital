<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
    private function api(): Api
    {
        return new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );
    }

    // Step 1: Create Razorpay order and return to frontend
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount'      => 'required|numeric|min:1',
            'plan_name'   => 'required|string|max:100',
            'plan_period' => 'required|in:monthly,yearly',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Please login to continue.'], 401);
        }

        $amountPaise = (int) ($request->amount * 100); // Razorpay uses paise

        // Create order in our DB
        $orderNumber = 'AMD-' . strtoupper(uniqid());
        $order = Order::create([
            'order_number'   => $orderNumber,
            'user_id'        => $user->id,
            'subtotal'       => $request->amount,
            'tax'            => 0,
            'discount'       => 0,
            'total'          => $request->amount,
            'status'         => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'razorpay',
            'notes'          => $request->plan_name . ' (' . $request->plan_period . ')',
        ]);

        // Create Razorpay order
        try {
            $rzpOrder = $this->api()->order->create([
                'receipt'         => $orderNumber,
                'amount'          => $amountPaise,
                'currency'        => 'INR',
                'payment_capture' => 1,
                'notes'           => [
                    'plan'   => $request->plan_name,
                    'period' => $request->plan_period,
                    'user'   => $user->email,
                ],
            ]);

            return response()->json([
                'rzp_order_id' => $rzpOrder->id,
                'order_id'     => $order->id,
                'amount'       => $amountPaise,
                'currency'     => 'INR',
                'key_id'       => config('services.razorpay.key_id'),
                'name'         => 'Auromax Digital',
                'description'  => $request->plan_name . ' Plan',
                'user_name'    => $user->name,
                'user_email'   => $user->email,
                'user_phone'   => $user->phone ?? '',
            ]);
        } catch (\Exception $e) {
            $order->delete();
            Log::error('Razorpay order creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment gateway error. Please try again.'], 500);
        }
    }

    // Step 2: Verify payment after Razorpay callback
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
            'order_id'            => 'required|integer',
        ]);

        $expectedSignature = hash_hmac(
            'sha256',
            $request->razorpay_order_id . '|' . $request->razorpay_payment_id,
            config('services.razorpay.key_secret')
        );

        $order = Order::findOrFail($request->order_id);

        if ($expectedSignature !== $request->razorpay_signature) {
            // Signature mismatch — payment tampered
            $order->update(['payment_status' => 'failed', 'status' => 'cancelled']);

            Payment::create([
                'order_id'         => $order->id,
                'user_id'          => Auth::id(),
                'payment_id'       => $request->razorpay_payment_id,
                'gateway'          => 'razorpay',
                'amount'           => $order->total,
                'currency'         => 'INR',
                'status'           => 'failed',
                'gateway_response' => $request->all(),
            ]);

            return response()->json(['success' => false, 'message' => 'Payment verification failed.'], 400);
        }

        // Valid payment — update records
        $order->update([
            'payment_status' => 'paid',
            'status'         => 'processing',
        ]);

        Payment::create([
            'order_id'         => $order->id,
            'user_id'          => Auth::id(),
            'payment_id'       => $request->razorpay_payment_id,
            'gateway'          => 'razorpay',
            'amount'           => $order->total,
            'currency'         => 'INR',
            'status'           => 'success',
            'gateway_response' => $request->all(),
        ]);

        return response()->json([
            'success'      => true,
            'message'      => 'Payment successful!',
            'order_number' => $order->order_number,
        ]);
    }

    // Razorpay webhook (optional but recommended for production)
    public function webhook(Request $request)
    {
        $webhookSecret = config('services.razorpay.webhook_secret');

        if ($webhookSecret) {
            $signature = $request->header('X-Razorpay-Signature');
            $payload   = $request->getContent();
            $expected  = hash_hmac('sha256', $payload, $webhookSecret);

            if (!hash_equals($expected, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 400);
            }
        }

        $event = $request->input('event');
        $paymentId = $request->input('payload.payment.entity.id');

        if ($event === 'payment.captured' && $paymentId) {
            $payment = Payment::where('payment_id', $paymentId)->first();
            if ($payment && $payment->status !== 'success') {
                $payment->update(['status' => 'success']);
                $payment->order->update(['payment_status' => 'paid', 'status' => 'processing']);
            }
        }

        return response()->json(['status' => 'ok']);
    }
}