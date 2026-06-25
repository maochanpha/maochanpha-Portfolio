<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
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
        if (!$this->certificate_image) {
            return null;
        }

        return asset('storage/' . $this->certificate_image);
    }
}