<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('mibrain/{any?}', function () {
        // return blade view for mibrain dashboard using the llarevel view
        return view('mibrain');
    })->where('any', '.*')->name('mibrain');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
