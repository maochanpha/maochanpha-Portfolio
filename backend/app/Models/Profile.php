<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'title',
        'short_bio',
        'about',
        'career_goal',
        'profile_photo',
        'cv_file',
        'email',
        'phone',
        'location',
        'github_url',
        'linkedin_url',
        'facebook_url',
        'telegram_url',
        'instagram_url',
    ];
    protected $appends = [
        'profile_photo_url',
        'cv_url',
    ];

    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (!$this->profile_photo) {
            return null;
        }

        return asset('storage/' . $this->profile_photo);
    }

    public function getCvUrlAttribute(): ?string
    {
        if (!$this->cv_file) {
            return null;
        }

        return asset('storage/' . $this->cv_file);
    }
}
