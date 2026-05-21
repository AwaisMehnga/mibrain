<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OnboardingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('web')->group(function () {
    Route::get('me', [AuthController::class, 'me'])->name('api.v1.me');

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('api.v1.auth.register');
        Route::post('login', [AuthController::class, 'login'])->name('api.v1.auth.login');
        Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
    });

    Route::prefix('catalog')->group(function () {
        Route::get('onboarding', [OnboardingController::class, 'catalog'])->name('api.v1.catalog.onboarding');
    });

    Route::prefix('onboarding')->group(function () {
        Route::put('/', [OnboardingController::class, 'store'])->name('api.v1.onboarding.store');
        Route::post('complete', [OnboardingController::class, 'complete'])->name('api.v1.onboarding.complete');
    });
});