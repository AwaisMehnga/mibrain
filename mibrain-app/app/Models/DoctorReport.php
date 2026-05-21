<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorReport extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sharedLinks()
    {
        return $this->hasMany(SharedReportLink::class);
    }

    public function storageObject()
    {
        return $this->belongsTo(StorageObject::class, 'storage_object_id');
    }
}
