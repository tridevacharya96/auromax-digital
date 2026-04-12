<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Celebrity extends Model
{
    protected $fillable = [
        'name', 'profession', 'photo', 'spotify_url',
        'instagram_url', 'youtube_url', 'bio',
        'is_featured', 'is_active', 'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active'   => 'boolean',
    ];
}
