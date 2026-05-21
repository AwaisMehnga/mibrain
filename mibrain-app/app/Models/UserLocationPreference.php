<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLocationPreference extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }
}
