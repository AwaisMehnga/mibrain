<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ApiResponse
{
    public static function success(mixed $data = [], array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => self::meta($meta),
        ], $status);
    }

    public static function error(string $code, string $message, array $fields = [], int $status = 400, array $meta = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'fields' => (object) $fields,
            ],
            'meta' => self::meta($meta),
        ], $status);
    }

    public static function validation(array $fields, string $message = 'Please check the highlighted fields.'): JsonResponse
    {
        return self::error('VALIDATION_ERROR', $message, $fields, 422);
    }

    public static function unauthenticated(string $message = 'Authentication required.'): JsonResponse
    {
        return self::error('UNAUTHENTICATED', $message, [], 401);
    }

    public static function forbidden(string $message = 'You are not allowed to perform this action.'): JsonResponse
    {
        return self::error('FORBIDDEN', $message, [], 403);
    }

    public static function notFound(string $message = 'Resource not found.'): JsonResponse
    {
        return self::error('NOT_FOUND', $message, [], 404);
    }

    public static function conflict(string $message = 'The request conflicts with existing data.'): JsonResponse
    {
        return self::error('CONFLICT', $message, [], 409);
    }

    private static function meta(array $meta = []): array
    {
        return array_merge([
            'requestId' => request()->header('X-Request-Id', (string) Str::uuid()),
            'serverTime' => now()->toIso8601String(),
        ], $meta);
    }
}