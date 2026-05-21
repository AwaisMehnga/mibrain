<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskFactor extends Model
{
    protected $guarded = ['id'];

    public function riskScore()
    {
        return $this->belongsTo(RiskScore::class);
    }
}
