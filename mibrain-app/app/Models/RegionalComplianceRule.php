<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegionalComplianceRule extends Model
{
    protected $guarded = ['id'];

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }
}
