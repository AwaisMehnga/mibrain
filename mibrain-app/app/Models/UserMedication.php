<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMedication extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function medication()
    {
        return $this->belongsTo(MedicationCatalog::class, 'medication_id');
    }

    public function attackMedications()
    {
        return $this->hasMany(AttackMedication::class);
    }
}
