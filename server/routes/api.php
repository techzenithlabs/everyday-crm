<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);




Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
//Admin Middleware
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/roles', [RoleController::class, 'index']);
    Route::post('/admin/invite-user', [AdminController::class, 'inviteUser']);
    Route::get('/admin/users', [AdminController::class, 'listInvitedUsers']);
});


//Google and Slack OAuth routes
Route::get('auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Invite-based Registration Routes (✅ Add these here)
Route::post('/generate-register-link', [AuthController::class, 'generateRegisterLink']);
Route::get('/register/token-verify/{token}', [AuthController::class, 'verifyRegisterToken']);


