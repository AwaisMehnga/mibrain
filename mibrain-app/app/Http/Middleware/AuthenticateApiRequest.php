<?php

namespace App\Http\Middleware;

use App\Support\JwtToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->bearerToken() ?: $request->cookie('mibrain_access_token');

        if ($plainToken) {
            $resolvedToken = JwtToken::resolve($plainToken);

            if ($resolvedToken) {
                $resolvedToken['token']->forceFill(['last_used_at' => now()])->save();
                $request->setUserResolver(fn () => $resolvedToken['user']);
                $request->attributes->set('api_access_token', $resolvedToken['token']);
            }
        }

        return $next($request);
    }
}
