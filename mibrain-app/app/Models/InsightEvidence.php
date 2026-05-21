<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsightEvidence extends Model
{
    protected $table = 'insight_evidence';

    protected $guarded = ['id'];

    public function insight()
    {
        return $this->belongsTo(Insight::class);
    }
}
