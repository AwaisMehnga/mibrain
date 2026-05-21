<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackTrigger extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function trigger()
    {
        return $this->belongsTo(TriggerCatalog::class, 'trigger_id');
    }
}
