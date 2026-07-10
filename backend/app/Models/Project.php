<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use ResolvesStorageUrls;

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
        return $this->storageUrl($this->image);
    }
}
