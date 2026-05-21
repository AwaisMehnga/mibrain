<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackAuraType extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function auraType()
    {
        return $this->belongsTo(AuraType::class);
    }
}
