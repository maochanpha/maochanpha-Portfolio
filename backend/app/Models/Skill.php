<?php

namespace App\Models;

use App\Models\Concerns\ResolvesStorageUrls;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use ResolvesStorageUrls;

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
        return $this->storageUrl($this->icon);
    }
}
