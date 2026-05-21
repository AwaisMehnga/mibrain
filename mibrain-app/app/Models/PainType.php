<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PainType extends Model
{
    protected $guarded = ['id'];

    public function attackPainTypes()
    {
        return $this->hasMany(AttackPainType::class);
    }
}
