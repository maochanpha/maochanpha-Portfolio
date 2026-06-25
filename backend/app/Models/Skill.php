<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    protected $cast = [
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

        return asset('storage/' . $this->icon);
    }
}
