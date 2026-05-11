<?php

namespace App\Http\Controllers;

use App\Models\CelebrityWishBooking;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class CelebrityWishController extends Controller
{
    private function api(): Api
    {
        return new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'product_id'     => 'required|exists:products,id',
            'recipient_name' => 'required|string|max:255',
            'occasion'       => 'required|string|max:255',
            'custom_message' => 'required|string|max:1000',
            'from_name'      => 'required|string|max:255',
            'contact_email'  => 'required|email',
            'contact_phone'  => 'nullable|string|max:20',
        ]);

        $product = Product::findOrFail($request->product_id);
        $amount  = $product->sale_price ?? $product->price;
        $amountPaise = (int)($amount * 100);
        $orderNumber = 'WISH-' . strtoupper(uniqid());

        $booking = CelebrityWishBooking::create([
            'product_id'      => $product->id,
            'user_id'         => Auth::id(),
            'order_number'    => $orderNumber,
            'recipient_name'  => $request->recipient_name,
            'occasion'        => $request->occasion,
            'custom_message'  => $request->custom_message,
            'from_name'       => $request->from_name,
            'contact_email'   => $request->contact_email,
            'contact_phone'   => $request->contact_phone,
            'amount'          => $amount,
            'payment_status'  => 'pending',
        ]);

        try {
            $rzpOrder = $this->api()->order->create([
                'receipt'         => $orderNumber,
                'amount'          => $amountPaise,
                'currency'        => 'INR',
                'payment_capture' => 1,
                'notes'           => [
                    'celebrity'  => $product->celebrity_name,
                    'recipient'  => $request->recipient_name,
                    'occasion'   => $request->occasion,
                ],
            ]);

            $booking->update(['razorpay_order_id' => $rzpOrder->id]);

            return response()->json([
                'rzp_order_id' => $rzpOrder->id,
                'booking_id'   => $booking->id,
                'amount'       => $amountPaise,
                'currency'     => 'INR',
                'key_id'       => config('services.razorpay.key_id'),
                'name'         => 'Auromax Digital',
                'description'  => "Celebrity Wish by {$product->celebrity_name}",
                'user_name'    => $request->from_name,
                'user_email'   => $request->contact_email,
                'user_phone'   => $request->contact_phone ?? '',
            ]);
        } catch (\Exception $e) {
            $booking->delete();
            Log::error('Celebrity wish order failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment gateway error. Please try again.'], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
            'booking_id'          => 'required|integer',
        ]);

        $expected = hash_hmac(
            'sha256',
            $request->razorpay_order_id . '|' . $request->razorpay_payment_id,
            config('services.razorpay.key_secret')
        );

        $booking = CelebrityWishBooking::findOrFail($request->booking_id);

        if ($expected !== $request->razorpay_signature) {
            $booking->update(['payment_status' => 'failed']);
            return response()->json(['success' => false, 'message' => 'Payment verification failed.'], 400);
        }

        $booking->update([
            'payment_status'       => 'paid',
            'razorpay_payment_id'  => $request->razorpay_payment_id,
            'fulfillment_status'   => 'in_progress',
        ]);

        return response()->json([
            'success'      => true,
            'message'      => 'Booking confirmed! Your celebrity wish is being processed.',
            'order_number' => $booking->order_number,
        ]);
    }
}