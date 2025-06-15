<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

//Google and Slack OAuth routes
Route::get('auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Invite-based Registration Routes (✅ Add these here)
Route::post('/generate-register-link', [AuthController::class, 'generateRegisterLink']);
Route::get('/register/token-verify/{token}', [AuthController::class, 'verifyRegisterToken']);


