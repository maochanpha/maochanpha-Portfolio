<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use ResolvesStorageUrls;

    protected $fillable = [
        'organization',
        'role',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'certificate_image',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = [
        'certificate_image_url',
    ];

    public function getCertificateImageUrlAttribute(): ?string
    {
        return $this->storageUrl($this->certificate_image);
    }
}
