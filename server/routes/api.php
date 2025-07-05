<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;;

// --- Public Auth Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);

// --- OAuth Routes ---
Route::get('auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// --- Invite Token Verification & Registration ---
Route::post('/generate-register-link', [AuthController::class, 'generateRegisterLink']);
Route::get('/register/token-verify/{token}', [AuthController::class, 'verifyRegisterToken']);

// --- Authenticated User Routes ---
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Get current user's allowed menus
    Route::get('/menus', [MenuController::class, 'getUserMenus']);
});

// --- Admin Routes ---
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/roles', [RoleController::class, 'getRoles']);

    // ✅ Invite User (can move this later to InviteController if needed)
    Route::post('/invite-user', [UserController::class, 'inviteUser']);

    // ✅ List Invited Users
    Route::get('/users', [UserController::class, 'listInvitedUsers']);

    Route::get('/role-permissions/{roleId}', [RoleController::class, 'getRolePermissions']);
    Route::get('/modules', [PermissionController::class, 'listModules']);
    Route::get('/modules-with-permissions', [PermissionController::class, 'getModulesWithPermissions']);
    Route::get('/permissions/grouped', [PermissionController::class, 'allGroupedPermissions']);
    Route::post('/update-menu-order', [MenuController::class, 'updateSortOrder']);
    Route::get('/sidebar-menus', [AdminMenuController::class, 'getSidebarMenus']);

    // You can add more admin-specific endpoints here in future
});
