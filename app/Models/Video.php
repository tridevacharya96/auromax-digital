<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title', 'description', 'youtube_url', 'youtube_id',
        'thumbnail', 'category', 'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    // Auto extract YouTube ID from URL
    public static function extractYoutubeId(string $url): string
    {
        preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $matches);
        return $matches[1] ?? '';
    }

    // Get thumbnail from YouTube
    public function getThumbnailUrlAttribute(): string
    {
        return "https://img.youtube.com/vi/{$this->youtube_id}/maxresdefault.jpg";
    }
}
