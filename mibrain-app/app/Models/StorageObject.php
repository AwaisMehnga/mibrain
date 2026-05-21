<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StorageObject extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voiceNotes()
    {
        return $this->hasMany(VoiceNote::class, 'storage_object_id');
    }

    public function doctorReports()
    {
        return $this->hasMany(DoctorReport::class, 'storage_object_id');
    }
}
