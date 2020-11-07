<?php

use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PlaylistController;
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
    Route::post('/track/search', [TrackController::class, 'search'])->name('track.search');
    Route::get('/track/genres', [TrackController::class, 'genres'])->name('track.genres');
    Route::get('/track/years', [TrackController::class, 'years'])->name('track.years');
    Route::get('/track/stream/{track:fingerprint}', [TrackController::class, 'stream'])->name('track.stream');
    Route::get('/track/{track:fingerprint}/playlists', [TrackController::class, 'playlists'])->name('track.playlists');

    // Playlist
    Route::get('/playlist', [PlaylistController::class, 'index'])->name('playlist.index');
    Route::post('/playlist', [PlaylistController::class, 'store'])->name('playlist.store');
    Route::delete('/playlist/{playlist}', [PlaylistController::class, 'destroy'])->name('playlist.destroy');
    Route::post('/playlist/{playlist}/track', [PlaylistController::class, 'track_toggle'])->name('playlist.track_toggle');
    Route::get('/playlist/{playlist}/load', [PlaylistController::class, 'load'])->name('playlist.load');
    Route::post('/playlist/{playlist}/save', [PlaylistController::class, 'save'])->name('playlist.save');
});
