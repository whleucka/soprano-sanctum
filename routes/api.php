<?php

use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', [UserController::class, 'index'])->name('user.index');

    // Directory
    Route::get('/directory', [DirectoryController::class, 'index'])->name('directory.index');
    Route::get('/directory/scan/{directory}', [DirectoryController::class, 'scan'])->name('directory.scan');
    Route::post('/directory', [DirectoryController::class, 'store'])->name('directory.store');
    Route::patch('/directory/{directory}', [DirectoryController::class, 'update'])->name('directory.update');
    Route::delete('/directory/{directory}', [DirectoryController::class, 'destroy'])->name('directory.destroy');

    // Track
    Route::post('/track', [TrackController::class, 'synch'])->name('track.synch');
});
