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
use App\Support\JwtToken;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::unauthenticated();
        }

        return ApiResponse::success([
            'user' => $this->transformBootstrapUser($user->load('profile', 'subscriptions.plan', 'notificationPreferences')),
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

        $this->hydrateUserFromPayload($request, $user);
        $this->persistOnboardingDraft($request, $user);

        $tokens = $this->issueTokens($user, $request);

        return $this->withTokenCookies(ApiResponse::success([
            'user' => $this->transformAuthUser($user->fresh()),
            ...$this->tokenPayload($request, $tokens),
        ], status: 201), $tokens);
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

        $user = User::query()->where('email', $request->input('email'))->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return ApiResponse::error('UNAUTHENTICATED', 'These credentials do not match our records.', ['email' => 'These credentials do not match our records.'], 401);
        }

        $user->load('profile', 'subscriptions.plan');

        $tokens = $this->issueTokens($user, $request);

        return $this->withTokenCookies(ApiResponse::success([
            'user' => $this->transformAuthUser($user),
            ...$this->tokenPayload($request, $tokens),
        ]), $tokens);
    }

    public function refresh(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'refreshToken' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        $refreshToken = $request->input('refreshToken') ?: $request->cookie('mibrain_refresh_token');

        if (! $refreshToken) {
            return ApiResponse::unauthenticated('Refresh token is required.');
        }

        $resolvedToken = JwtToken::resolve($refreshToken, 'refresh');

        if (! $resolvedToken) {
            return ApiResponse::unauthenticated('Refresh token is invalid or expired.');
        }

        $resolvedToken['token']->delete();

        $tokens = $this->issueTokens($resolvedToken['user'], $request);

        return $this->withTokenCookies(ApiResponse::success($this->usesCookieAuth($request) ? [
            'expiresIn' => JwtToken::ACCESS_TTL,
        ] : $tokens), $tokens);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($token = $request->attributes->get('api_access_token')) {
            $token->delete();
        }

        $refreshToken = $request->input('refreshToken') ?: $request->cookie('mibrain_refresh_token');

        if ($refreshToken) {
            JwtToken::revoke($refreshToken, 'refresh');
        }

        if (! $token && ! $refreshToken) {
            return ApiResponse::unauthenticated();
        }

        return $this->withoutTokenCookies(ApiResponse::success([
            'loggedOut' => true,
        ]));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        Password::sendResetLink($request->only('email'));

        return ApiResponse::success([
            'message' => 'If an account exists, reset instructions were sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resetToken' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::validation($validator->errors()->toArray());
        }

        $resetRecord = DB::table('password_reset_tokens')
            ->get()
            ->first(function ($record) use ($request) {
                return $this->resetTokenMatches($request->input('resetToken'), $record->token);
            });

        $user = $resetRecord ? User::query()->where('email', $resetRecord->email)->first() : null;

        if (! $resetRecord || ! $user) {
            return ApiResponse::validation([
                'resetToken' => 'The reset token is invalid or expired.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->input('newPassword')),
            'remember_token' => Str::random(60),
        ])->save();

        $user->apiAccessTokens()->delete();
        DB::table('password_reset_tokens')->where('email', $resetRecord->email)->delete();

        event(new PasswordReset($user));

        return ApiResponse::success([
            'passwordUpdated' => true,
        ]);
    }

    private function issueTokens(User $user, Request $request): array
    {
        return JwtToken::issuePair($user, $request->userAgent() ?: 'api');
    }

    private function tokenPayload(Request $request, array $tokens): array
    {
        if ($this->usesCookieAuth($request)) {
            return [
                'tokens' => [
                    'expiresIn' => JwtToken::ACCESS_TTL,
                ],
            ];
        }

        return [
            'tokens' => $tokens,
        ];
    }

    private function usesCookieAuth(Request $request): bool
    {
        return $request->header('X-Auth-Mode') === 'cookie';
    }

    private function withTokenCookies(JsonResponse $response, array $tokens): JsonResponse
    {
        $response->headers->setCookie($this->tokenCookie('mibrain_access_token', $tokens['accessToken'], JwtToken::ACCESS_TTL));
        $response->headers->setCookie($this->tokenCookie('mibrain_refresh_token', $tokens['refreshToken'], JwtToken::REFRESH_TTL));

        return $response;
    }

    private function withoutTokenCookies(JsonResponse $response): JsonResponse
    {
        $response->headers->setCookie($this->tokenCookie('mibrain_access_token', '', -3600));
        $response->headers->setCookie($this->tokenCookie('mibrain_refresh_token', '', -3600));

        return $response;
    }

    private function tokenCookie(string $name, string $value, int $ttl): Cookie
    {
        return new Cookie(
            $name,
            $value,
            now()->addSeconds($ttl),
            '/',
            null,
            (bool) config('app.jwt_cookie_secure'),
            true,
            false,
            config('app.jwt_cookie_same_site', 'strict')
        );
    }

    private function resetTokenMatches(string $plainToken, string $storedToken): bool
    {
        try {
            return Hash::check($plainToken, $storedToken) || hash_equals($plainToken, $storedToken);
        } catch (\RuntimeException) {
            return hash_equals($plainToken, $storedToken);
        }
    }

    private function transformAuthUser(User $user): array
    {
        return [
            'id' => (string) $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'isOnboarded' => (bool) $user->is_onboarded,
        ];
    }

    private function transformBootstrapUser(User $user): array
    {
        return [
            'id' => (string) $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'countryCode' => $user->profile?->country_code,
            'timezone' => $user->profile?->timezone,
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

    private function hydrateUserFromPayload(Request $request, User $user): void
    {
        $draft = $request->input('onboarding', []);

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
    }

    private function persistOnboardingDraft(Request $request, User $user): void
    {
        $draft = $request->input('onboarding', []);

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
