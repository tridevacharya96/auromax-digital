<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name','slug','description','type','price',
        'sale_price','stock','image','file_path',
        'category','is_active','is_featured'
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'is_featured' => 'boolean',
        'price'       => 'decimal:2',
        'sale_price'  => 'decimal:2',
    ];

    public function orderItems() { return $this->hasMany(OrderItem::class); }
}
