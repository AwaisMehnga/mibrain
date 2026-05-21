<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackMedication extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function userMedication()
    {
        return $this->belongsTo(UserMedication::class);
    }
}
