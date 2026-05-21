<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackRecoveryState extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }
}
