<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'auth_provider',
        'auth_provider_user_id',
        'email_encrypted',
        'phone_encrypted',
        'phone_verified_at',
        'status',
        'is_onboarded',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_onboarded' => 'boolean',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function devices()
    {
        return $this->hasMany(UserDevice::class);
    }

    public function consentRecords()
    {
        return $this->hasMany(ConsentRecord::class);
    }

    public function privacyRequests()
    {
        return $this->hasMany(PrivacyRequest::class);
    }

    public function auditEventsAsActor()
    {
        return $this->hasMany(AuditEvent::class, 'actor_user_id');
    }

    public function auditEventsAsTarget()
    {
        return $this->hasMany(AuditEvent::class, 'target_user_id');
    }

    public function attacks()
    {
        return $this->hasMany(Attack::class);
    }

    public function dailyCheckins()
    {
        return $this->hasMany(DailyCheckin::class);
    }

    public function riskScores()
    {
        return $this->hasMany(RiskScore::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function notificationPreferences()
    {
        return $this->hasMany(NotificationPreference::class);
    }

    public function weeklySummaries()
    {
        return $this->hasMany(WeeklySummary::class);
    }

    public function insights()
    {
        return $this->hasMany(Insight::class);
    }

    public function doctorReports()
    {
        return $this->hasMany(DoctorReport::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function storageObjects()
    {
        return $this->hasMany(StorageObject::class);
    }

    public function locationPreference()
    {
        return $this->hasOne(UserLocationPreference::class);
    }
}
