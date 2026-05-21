<?php

namespace App\Http\Middleware;

use App\Models\ApiAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->bearerToken();

        if ($plainToken) {
            $accessToken = ApiAccessToken::query()
                ->with('user')
                ->where('token', hash('sha256', $plainToken))
                ->where(function ($query) {
                    $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->first();

            if ($accessToken?->user) {
                $accessToken->forceFill(['last_used_at' => now()])->save();
                $request->setUserResolver(fn () => $accessToken->user);
                $request->attributes->set('api_access_token', $accessToken);
            }
        }

        return $next($request);
    }
}
