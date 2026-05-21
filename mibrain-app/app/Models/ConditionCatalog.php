<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConditionCatalog extends Model
{
    protected $guarded = ['id'];

    public function userConditions()
    {
        return $this->hasMany(UserCondition::class, 'condition_id');
    }
}
