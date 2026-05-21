<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TriggerCatalog extends Model
{
    protected $guarded = ['id'];

    public function userTriggers()
    {
        return $this->hasMany(UserTrigger::class, 'trigger_id');
    }

    public function attackTriggers()
    {
        return $this->hasMany(AttackTrigger::class, 'trigger_id');
    }
}
