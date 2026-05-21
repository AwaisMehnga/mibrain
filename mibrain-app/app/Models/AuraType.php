<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuraType extends Model
{
    protected $guarded = ['id'];

    public function attackAuraTypes()
    {
        return $this->hasMany(AttackAuraType::class);
    }
}
