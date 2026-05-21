<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $primaryKey = 'code';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = ['code'];

    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class, 'country_code', 'code');
    }

    public function locationPreferences()
    {
        return $this->hasMany(UserLocationPreference::class, 'country_code', 'code');
    }

    public function medicationCatalogs()
    {
        return $this->hasMany(MedicationCatalog::class, 'country_code', 'code');
    }

    public function complianceRules()
    {
        return $this->hasMany(RegionalComplianceRule::class, 'country_code', 'code');
    }
}
