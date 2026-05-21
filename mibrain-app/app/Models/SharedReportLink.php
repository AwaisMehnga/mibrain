<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedReportLink extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'last_accessed_at' => 'datetime',
    ];

    public function doctorReport()
    {
        return $this->belongsTo(DoctorReport::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
