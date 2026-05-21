<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ConditionCatalog;
use App\Models\MedicationCatalog;
use App\Models\TriggerCatalog;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        if ($request->user()) {
            $request->user()->forceFill(['is_onboarded' => true])->save();
        }

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
}