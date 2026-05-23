<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('mibrain');
})->name('mibrain');

Route::get('setup/{any?}', function () {
    return view('setup');
})->where('any', '.*')->name('setup');

Route::get('{any}', function () {
    return view('mibrain');
})->where('any', '^(check-in|log|insights|risk-detail|history|report|notifications|profile)(/.*)?$');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
