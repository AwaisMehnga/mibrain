<?php

namespace App\Support;

use App\Models\ApiAccessToken;
use App\Models\User;
use Illuminate\Support\Str;

class JwtToken
{
    public const ACCESS_TTL = 3600;
    public const REFRESH_TTL = 2592000;
    private const ALGORITHM = 'HS256';

    public static function issuePair(User $user, string $name = 'api'): array
    {
        $accessToken = self::issue($user, 'access', self::ACCESS_TTL, $name);
        $refreshToken = self::issue($user, 'refresh', self::REFRESH_TTL, $name);

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
            'expiresIn' => self::ACCESS_TTL,
        ];
    }

    public static function resolve(string $token, string $type = 'access'): ?array
    {
        $payload = self::decode($token);

        if (! $payload || ($payload['typ'] ?? null) !== $type || empty($payload['jti']) || empty($payload['sub'])) {
            return null;
        }

        $storedToken = ApiAccessToken::query()
            ->with('user')
            ->where('token', hash('sha256', $payload['jti']))
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->first();

        if (! $storedToken?->user || (string) $storedToken->user->getKey() !== (string) $payload['sub']) {
            return null;
        }

        return [
            'payload' => $payload,
            'token' => $storedToken,
            'user' => $storedToken->user,
        ];
    }

    public static function revoke(string $token, string $type): void
    {
        $resolved = self::resolve($token, $type);

        if ($resolved) {
            $resolved['token']->delete();
        }
    }

    private static function issue(User $user, string $type, int $ttl, string $name): string
    {
        $jti = (string) Str::uuid();
        $expiresAt = now()->addSeconds($ttl);

        $user->apiAccessTokens()->create([
            'name' => "{$name}:{$type}",
            'token' => hash('sha256', $jti),
            'expires_at' => $expiresAt,
        ]);

        return self::encode([
            'iss' => config('app.url'),
            'sub' => (string) $user->getKey(),
            'jti' => $jti,
            'typ' => $type,
            'iat' => now()->timestamp,
            'exp' => $expiresAt->timestamp,
        ]);
    }

    private static function encode(array $payload): string
    {
        $header = [
            'typ' => 'JWT',
            'alg' => self::ALGORITHM,
        ];

        $segments = [
            self::base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR)),
            self::base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR)),
        ];

        $segments[] = self::signature($segments[0].'.'.$segments[1]);

        return implode('.', $segments);
    }

    private static function decode(string $token): ?array
    {
        $segments = explode('.', $token);

        if (count($segments) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $segments;

        if (! hash_equals(self::signature($header.'.'.$payload), $signature)) {
            return null;
        }

        $decodedHeader = json_decode(self::base64UrlDecode($header), true);
        $decodedPayload = json_decode(self::base64UrlDecode($payload), true);

        if (($decodedHeader['alg'] ?? null) !== self::ALGORITHM || ! is_array($decodedPayload)) {
            return null;
        }

        if (($decodedPayload['exp'] ?? 0) < now()->timestamp) {
            return null;
        }

        return $decodedPayload;
    }

    private static function signature(string $value): string
    {
        return self::base64UrlEncode(hash_hmac('sha256', $value, self::secret(), true));
    }

    private static function secret(): string
    {
        $key = (string) config('app.jwt_key');

        if (str_starts_with($key, 'base64:')) {
            return base64_decode(substr($key, 7), true) ?: $key;
        }

        return $key;
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $decodedValue = strtr($value, '-_', '+/');
        $paddedValue = str_pad($decodedValue, strlen($decodedValue) + ((4 - strlen($decodedValue) % 4) % 4), '=', STR_PAD_RIGHT);

        return base64_decode($paddedValue) ?: '';
    }
}
