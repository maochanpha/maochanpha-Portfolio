<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
        'level',
        'icon',
        'sort_order',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
    protected $appends = [
        'icon_url',
    ];
    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon) {
            return null;
        }

        return Storage::disk('public')->url($this->icon);
    }
}
