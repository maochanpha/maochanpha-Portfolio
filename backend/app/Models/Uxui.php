<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uxui extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'tools',
        'images',
        'figma_url',
        'category',
    ];
    protected $casts = [
        'tools' => 'array',
        'images'=> 'array',
    ];

    protected $appends = [
        'image_urls',
    ];

    public function getImageUrlsAttribute(): array
    {
        return collect($this->images ?? [])
            ->map(fn ($path) => asset('storage/' . $path))
            ->values()
            ->all();
    }
}
