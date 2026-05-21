<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ConditionCatalog;
use App\Models\MedicationCatalog;
use App\Models\NotificationPreference;
use App\Models\TriggerCatalog;
use App\Models\UserCondition;
use App\Models\UserMedication;
use App\Models\UserTrigger;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    public function catalog(): JsonResponse
    {
        return ApiResponse::success([
            'conditions' => $this->conditions(),
            'triggers' => $this->triggers(),
            'medications' => [
                'acute' => $this->medications('acute'),
                'preventive' => $this->medications('preventive'),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'conditions' => ['nullable', 'array'],
            'triggers' => ['nullable', 'array'],
            'medications' => ['nullable', 'array'],
            'preferences' => ['nullable', 'array'],
            'currentStep' => ['nullable', 'string', 'max:64'],
            'isComplete' => ['nullable', 'boolean'],
            'countryCode' => ['nullable', 'string', 'size:2'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:16'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        $draft = $validator->validated();
        $request->session()->put('onboarding_draft', array_merge($request->session()->get('onboarding_draft', []), $draft));

        return ApiResponse::success([
            'currentStep' => $draft['currentStep'] ?? $request->session()->get('onboarding_draft.currentStep', 'welcome'),
            'isComplete' => (bool) ($draft['isComplete'] ?? false),
        ]);
    }

    public function complete(Request $request): JsonResponse
    {
        $this->persistOnboardingDraft($request);

        $request->user()->forceFill(['is_onboarded' => true])->save();

        $request->session()->forget('onboarding_draft');

        return ApiResponse::success([
            'isOnboarded' => true,
        ]);
    }

    private function conditions(): array
    {
        $conditions = ConditionCatalog::query()->where('is_active', true)->orderBy('name')->get();

        if ($conditions->isNotEmpty()) {
            return $conditions->map(fn (ConditionCatalog $condition) => [
                'id' => $condition->code,
                'name' => $condition->name,
                'description' => $condition->description,
            ])->all();
        }

        return [
            ['id' => 'chronic', 'name' => 'Chronic Migraine', 'description' => 'More than 15 headache days per month'],
            ['id' => 'episodic', 'name' => 'Episodic Migraine', 'description' => 'Fewer than 15 headache days per month'],
            ['id' => 'aura', 'name' => 'Migraine with Aura', 'description' => 'Visual or sensory symptoms before attacks'],
            ['id' => 'preventive', 'name' => 'Currently on preventive medication', 'description' => 'Taking daily preventive drugs'],
            ['id' => 'menstrual', 'name' => 'Menstrual migraines', 'description' => 'Attacks linked to my cycle'],
            ['id' => 'weather', 'name' => 'Weather-sensitive', 'description' => 'Barometric pressure triggers my attacks'],
        ];
    }

    private function triggers(): array
    {
        $triggers = TriggerCatalog::query()->where('is_active', true)->orderBy('name')->get();

        if ($triggers->isNotEmpty()) {
            return $triggers->map(fn (TriggerCatalog $trigger) => [
                'id' => $trigger->code,
                'name' => $trigger->name,
                'category' => $trigger->category,
            ])->all();
        }

        return [
            ['id' => 'sleep', 'name' => 'Poor sleep', 'category' => 'sleep'],
            ['id' => 'light', 'name' => 'Bright light', 'category' => 'sensory'],
            ['id' => 'weather', 'name' => 'Weather change', 'category' => 'environment'],
        ];
    }

    private function medications(string $type): array
    {
        $medications = MedicationCatalog::query()->where('is_active', true)->where('medication_class', $type === 'acute' ? 'triptan' : 'preventive')->orderBy('generic_name')->get();

        if ($medications->isNotEmpty()) {
            return $medications->map(fn (MedicationCatalog $medication) => [
                'id' => $medication->id,
                'name' => $medication->brand_name ?: $medication->generic_name,
            ])->all();
        }

        return $type === 'acute'
            ? [
                ['id' => 'sumatriptan', 'name' => 'Sumatriptan'],
                ['id' => 'rizatriptan', 'name' => 'Rizatriptan'],
                ['id' => 'nurtec', 'name' => 'Nurtec'],
                ['id' => 'ubrelvy', 'name' => 'Ubrelvy'],
            ]
            : [
                ['id' => 'topiramate', 'name' => 'Topiramate'],
                ['id' => 'amitriptyline', 'name' => 'Amitriptyline'],
                ['id' => 'propranolol', 'name' => 'Propranolol'],
                ['id' => 'aimovig', 'name' => 'Aimovig'],
            ];
    }

    private function persistOnboardingDraft(Request $request): void
    {
        $user = $request->user();
        $draft = $request->session()->get('onboarding_draft', []);

        $profileData = [
            'country_code' => $draft['countryCode'] ?? $user->profile?->country_code,
            'timezone' => $draft['timezone'] ?? $user->profile?->timezone ?? config('app.timezone'),
            'locale' => $draft['locale'] ?? $user->profile?->locale ?? app()->getLocale(),
            'measurement_system' => $draft['preferences']['measurementSystem'] ?? $user->profile?->measurement_system ?? 'imperial',
        ];

        $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);

        foreach (($draft['conditions'] ?? []) as $code) {
            $condition = ConditionCatalog::firstOrCreate(
                ['code' => $code],
                ['name' => Str::headline($code), 'description' => null, 'is_active' => true]
            );

            UserCondition::updateOrCreate([
                'user_id' => $user->id,
                'condition_id' => $condition->id,
            ], [
                'source' => 'onboarding',
            ]);
        }

        foreach (($draft['triggers'] ?? []) as $code) {
            $trigger = TriggerCatalog::firstOrCreate(
                ['code' => $code],
                ['name' => Str::headline($code), 'category' => 'custom', 'description' => null, 'is_active' => true]
            );

            UserTrigger::updateOrCreate([
                'user_id' => $user->id,
                'trigger_id' => $trigger->id,
            ], [
                'confidence' => 'likely',
            ]);
        }

        foreach (($draft['medications'] ?? []) as $type => $medications) {
            foreach ($medications as $medicationValue) {
                $name = is_array($medicationValue) ? ($medicationValue['name'] ?? $medicationValue['id'] ?? 'Medication') : $medicationValue;

                $catalog = MedicationCatalog::firstOrCreate(
                    ['generic_name' => $name],
                    ['brand_name' => null, 'medication_class' => $type === 'acute' ? 'triptan' : 'preventive', 'route' => 'oral', 'country_code' => $profileData['country_code'], 'is_active' => true]
                );

                UserMedication::updateOrCreate([
                    'user_id' => $user->id,
                    'medication_id' => $catalog->id,
                ], [
                    'type' => $type,
                    'is_active' => true,
                ]);
            }
        }

        $preferences = $draft['preferences'] ?? [];

        if (($preferences['notificationsEnabled'] ?? false) === true) {
            foreach (['risk_alert' => 'riskAlertTime', 'daily_checkin' => 'checkinTime'] as $type => $field) {
                NotificationPreference::updateOrCreate([
                    'user_id' => $user->id,
                    'notification_type' => $type,
                ], [
                    'enabled' => true,
                    'preferred_time' => $preferences[$field] ?? ($type === 'risk_alert' ? '07:30' : '08:00'),
                    'quiet_hours_start' => null,
                    'quiet_hours_end' => null,
                    'timezone' => $profileData['timezone'],
                ]);
            }
        }
    }
}
