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
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::unauthenticated();
        }

        return ApiResponse::success([
            'user' => $this->transformUser($user->load('profile', 'subscriptions.plan', 'notificationPreferences')),
            'preferences' => $this->preferencesFor($user),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class, 'email')],
            'password' => ['required', 'string', 'min:8'],
            'countryCode' => ['nullable', 'string', 'size:2'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:16'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        $user = User::create([
            'name' => $request->string('name'),
            'email' => $request->string('email'),
            'password' => Hash::make($request->string('password')),
            'status' => 'active',
            'is_onboarded' => false,
        ]);

        $this->hydrateUserFromSessionDraft($request, $user);
        $this->persistOnboardingDraft($request, $user);

        Auth::login($user);
        $request->session()->regenerate();

        return ApiResponse::success([
            'user' => $this->transformUser($user->fresh()->load('profile', 'subscriptions.plan')),
            'tokens' => $this->issueTokens($user, $request),
        ], status: 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return ApiResponse::error('UNAUTHENTICATED', 'These credentials do not match our records.', ['email' => 'These credentials do not match our records.'], 401);
        }

        $request->session()->regenerate();

        $user = $request->user()->load('profile', 'subscriptions.plan');

        return ApiResponse::success([
            'user' => $this->transformUser($user),
            'tokens' => $this->issueTokens($user, $request),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($token = $request->attributes->get('api_access_token')) {
            $token->delete();

            return ApiResponse::success([
                'loggedOut' => true,
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ApiResponse::success([
            'loggedOut' => true,
        ]);
    }

    private function issueTokens(User $user, Request $request): array
    {
        $plainToken = Str::random(80);

        $user->apiAccessTokens()->create([
            'name' => $request->userAgent() ?: 'api',
            'token' => hash('sha256', $plainToken),
        ]);

        return [
            'accessToken' => $plainToken,
            'tokenType' => 'Bearer',
            'refreshToken' => null,
            'expiresIn' => null,
        ];
    }

    private function transformUser(User $user): array
    {
        return [
            'id' => (string) $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'countryCode' => $user->profile?->country_code,
            'timezone' => $user->profile?->timezone,
            'locale' => $user->profile?->locale,
            'isOnboarded' => (bool) $user->is_onboarded,
            'subscriptionStatus' => $user->subscriptions->first()?->status,
        ];
    }

    private function preferencesFor(User $user): array
    {
        $preferences = $user->notificationPreferences->keyBy('notification_type');

        $riskAlert = $preferences->get('risk_alert');
        $dailyCheckin = $preferences->get('daily_checkin');

        return [
            'notificationsEnabled' => (bool) ($riskAlert?->enabled ?? false),
            'riskAlertTime' => $this->formatPreferredTime($riskAlert?->preferred_time, '07:30'),
            'checkinTime' => $this->formatPreferredTime($dailyCheckin?->preferred_time, '08:00'),
            'panicButtonLocation' => 'home-screen',
            'theme' => 'dark',
        ];
    }

    private function formatPreferredTime(mixed $time, string $default): string
    {
        if ($time === null || $time === '') {
            return $default;
        }

        if ($time instanceof \DateTimeInterface) {
            return $time->format('H:i');
        }

        return substr((string) $time, 0, 5) ?: $default;
    }

    private function hydrateUserFromSessionDraft(Request $request, User $user): void
    {
        $draft = $request->session()->get('onboarding_draft', []);

        if ($draft === []) {
            $user->profile()->create([
                'country_code' => $request->input('countryCode'),
                'timezone' => $request->input('timezone', config('app.timezone')),
                'locale' => $request->input('locale', app()->getLocale()),
            ]);

            return;
        }

        $user->profile()->create([
            'country_code' => $draft['countryCode'] ?? $request->input('countryCode'),
            'timezone' => $draft['timezone'] ?? $request->input('timezone', config('app.timezone')),
            'locale' => $draft['locale'] ?? $request->input('locale', app()->getLocale()),
            'measurement_system' => $draft['preferences']['measurementSystem'] ?? 'imperial',
        ]);

        $request->session()->put('onboarding_draft', $draft);
    }

    private function persistOnboardingDraft(Request $request, User $user): void
    {
        $draft = $request->session()->get('onboarding_draft', []);

        $profileData = [
            'country_code' => $draft['countryCode'] ?? $request->input('countryCode'),
            'timezone' => $draft['timezone'] ?? $request->input('timezone', config('app.timezone')),
            'locale' => $draft['locale'] ?? $request->input('locale', app()->getLocale()),
            'measurement_system' => $draft['preferences']['measurementSystem'] ?? 'imperial',
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

        $medications = $draft['medications'] ?? [];

        foreach (['acute', 'preventive'] as $type) {
            foreach (($medications[$type] ?? []) as $medicationValue) {
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
            NotificationPreference::updateOrCreate([
                'user_id' => $user->id,
                'notification_type' => 'risk_alert',
            ], [
                'enabled' => true,
                'preferred_time' => $preferences['riskAlertTime'] ?? '07:30',
                'quiet_hours_start' => null,
                'quiet_hours_end' => null,
                'timezone' => $profileData['timezone'],
            ]);

            NotificationPreference::updateOrCreate([
                'user_id' => $user->id,
                'notification_type' => 'daily_checkin',
            ], [
                'enabled' => true,
                'preferred_time' => $preferences['checkinTime'] ?? '08:00',
                'quiet_hours_start' => null,
                'quiet_hours_end' => null,
                'timezone' => $profileData['timezone'],
            ]);
        }
    }
}
