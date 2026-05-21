<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvironmentalObservation extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'observation_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
