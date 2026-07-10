<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class PosterProject extends Model
{
    use ResolvesStorageUrls;

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
        return $this->storageUrl($this->image);
    }
}
