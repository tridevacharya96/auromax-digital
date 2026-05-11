<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name','slug','description','type','price',
        'sale_price','stock','image','file_path',
        'category','is_active','is_featured',
        'is_celebrity_wish','celebrity_name','celebrity_photo',
        'delivery_days','sample_videos',
    ];

    protected $casts = [
        'is_active'          => 'boolean',
        'is_featured'        => 'boolean',
        'is_celebrity_wish'  => 'boolean',
        'price'              => 'decimal:2',
        'sale_price'         => 'decimal:2',
        'sample_videos'      => 'array',
    ];

    public function orderItems() { return $this->hasMany(OrderItem::class); }
    public function wishBookings() { return $this->hasMany(CelebrityWishBooking::class); }

    public function getCelebrityPhotoUrlAttribute(): ?string
    {
        return $this->celebrity_photo ? asset('storage/' . $this->celebrity_photo) : null;
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}