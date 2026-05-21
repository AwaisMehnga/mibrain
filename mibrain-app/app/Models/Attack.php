<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attack extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function locations()
    {
        return $this->hasMany(AttackLocation::class);
    }

    public function painTypes()
    {
        return $this->hasMany(AttackPainType::class);
    }

    public function symptoms()
    {
        return $this->hasMany(AttackSymptom::class);
    }

    public function auraTypes()
    {
        return $this->hasMany(AttackAuraType::class);
    }

    public function triggers()
    {
        return $this->hasMany(AttackTrigger::class);
    }

    public function medications()
    {
        return $this->hasMany(AttackMedication::class);
    }

    public function recoveryStates()
    {
        return $this->hasMany(AttackRecoveryState::class);
    }

    public function voiceNotes()
    {
        return $this->hasMany(VoiceNote::class);
    }
}
