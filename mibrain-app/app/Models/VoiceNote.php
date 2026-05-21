<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VoiceNote extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'parsed_fields' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function storageObject()
    {
        return $this->belongsTo(StorageObject::class, 'storage_object_id');
    }
}
