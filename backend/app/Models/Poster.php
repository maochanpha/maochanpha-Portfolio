<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poster extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'tools',
        'category',
    ];
    protected $casts = [
        'tools' => 'array',
    ];
    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        return asset('storage/' . $this->image);
    }
}
