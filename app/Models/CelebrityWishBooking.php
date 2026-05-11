<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CelebrityWishBooking extends Model
{
    protected $fillable = [
        'product_id','user_id','order_number','recipient_name',
        'occasion','custom_message','from_name','contact_email',
        'contact_phone','amount','payment_status',
        'razorpay_order_id','razorpay_payment_id',
        'fulfillment_status','delivered_video_url',
    ];

    public function product() { return $this->belongsTo(Product::class); }
    public function user()    { return $this->belongsTo(User::class); }
}