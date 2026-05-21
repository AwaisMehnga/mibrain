<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check() ? view('mibrain') : view('welcome');
})->name('mibrain');

Route::get('setup/{any?}', function () {
    return Auth::check() && Auth::user()?->is_onboarded ? redirect()->route('mibrain') : view('setup');
})->where('any', '.*')->name('setup');

Route::middleware(['auth'])->group(function () {
    Route::get('{any}', function () {
        return view('mibrain');
    })->where('any', '^(check-in|log|insights|risk-detail|history|report|notifications|profile)(/.*)?$');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
