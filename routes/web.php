<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();

Route::middleware(['guest'])->group(function() {
    // Guest
    Route::get('/', [HomeController::class, 'index'])->name('welcome');
});

Route::middleware(['auth'])->group(function() {
    // App routes
    Route::get('/{app}', [AppController::class, 'index'])
        ->where('app', '(home|podcasts|playlists|settings|search)')
        ->name('home');
});
Route::group(['middleware' => 'admin'], function () {
    Route::get('/admin', [AppController::class, 'index'])->name('admin');
});
