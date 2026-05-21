<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicationCatalog extends Model
{
    protected $guarded = ['id'];

    public function userMedications()
    {
        return $this->hasMany(UserMedication::class, 'medication_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }
}
