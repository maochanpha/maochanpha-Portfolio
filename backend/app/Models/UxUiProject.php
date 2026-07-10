<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class UxUiProject extends Model
{
    use ResolvesStorageUrls;

    protected $table = 'uxuis';

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
        return $this->storageUrls($this->images ?? []);
    }
}
