<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {
        return redirect('/setup/login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse|RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if ($request->expectsJson()) {
            return response()->json([
                'user' => $request->user()->load('profile'),
            ]);
        }

        return redirect()->intended(route('mibrain', absolute: false));
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()?->load('profile'),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse|RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Signed out']);
        }

        return redirect('/setup/login');
    }
}
