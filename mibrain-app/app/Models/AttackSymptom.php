<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackSymptom extends Model
{
    protected $guarded = ['id'];

    public function attack()
    {
        return $this->belongsTo(Attack::class);
    }

    public function symptom()
    {
        return $this->belongsTo(Symptom::class);
    }
}
