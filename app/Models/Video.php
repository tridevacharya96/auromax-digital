<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title', 'description', 'youtube_url', 'youtube_id',
        'thumbnail', 'category', 'order', 'is_active',
        'source', 'youtube_published_at',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public static function extractYoutubeId(string $url): string
    {
        preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $matches);
        return $matches[1] ?? '';
    }

    public function getThumbnailUrlAttribute(): string
    {
        return "https://img.youtube.com/vi/{$this->youtube_id}/maxresdefault.jpg";
    }
}