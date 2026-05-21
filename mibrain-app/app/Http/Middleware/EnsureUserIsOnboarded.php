<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsOnboarded
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->is_onboarded || $this->isOnboardingPath($request)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ONBOARDING_REQUIRED',
                    'message' => 'Complete onboarding before continuing.',
                ],
            ], 403);
        }

        return redirect('/setup/conditions');
    }

    private function isOnboardingPath(Request $request): bool
    {
        return $request->is(
            'setup',
            'setup/*',
            'api/v1/me',
            'api/v1/auth/logout',
            'api/v1/catalog/onboarding',
            'api/v1/onboarding',
            'api/v1/onboarding/*'
        );
    }
}
