<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'technologies',
        'image',
        'github_url',
        'live_demo_url',
        'category',
        'is_featured',
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        return Storage::disk(config('filesystems.default'))->url($this->image);
    }
}
