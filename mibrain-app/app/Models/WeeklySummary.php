<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklySummary extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'week_start_date' => 'date',
        'week_end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
