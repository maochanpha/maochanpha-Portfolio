<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosterProject extends Model
{
    protected $table = 'posters';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'tools',
        'image',
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
