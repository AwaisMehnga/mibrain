<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackPainType extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function painType()
    {
        return $this->belongsTo(PainType::class);
    }
}
