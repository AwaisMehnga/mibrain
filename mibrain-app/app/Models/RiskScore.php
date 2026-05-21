<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskScore extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'score_date' => 'date',
        'generated_at' => 'datetime',
        'score' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function factors()
    {
        return $this->hasMany(RiskFactor::class);
    }
}
