<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use ResolvesStorageUrls;

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
        return $this->storageUrl($this->profile_photo);
    }

    public function getCvUrlAttribute(): ?string
    {
        return $this->storageUrl($this->cv_file);
    }
}
