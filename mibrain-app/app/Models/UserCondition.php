<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCondition extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function condition()
    {
        return $this->belongsTo(ConditionCatalog::class, 'condition_id');
    }
}
