<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'education';

    protected $fillable = [
        'institution',
        'degree',
        'major',
        'start_year',
        'end_year',
        'is_current',
        'description',
    ];

    protected $casts = [
        'is_current' => 'boolean',
    ];
}