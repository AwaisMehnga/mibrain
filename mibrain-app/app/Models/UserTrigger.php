<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTrigger extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trigger()
    {
        return $this->belongsTo(TriggerCatalog::class, 'trigger_id');
    }
}
