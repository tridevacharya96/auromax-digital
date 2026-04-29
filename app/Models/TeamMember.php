<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name', 'role', 'bio', 'photo',
        'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url',
        'is_active', 'order',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }
}