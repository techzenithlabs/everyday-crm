<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;

use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Projects\BoardController;
use App\Http\Controllers\Projects\TaskController;


/// ─────────────────────────────
/// 🔓 PUBLIC AUTH ROUTES
/// ─────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);


/// ─────────────────────────────
/// 🌐 SOCIAL LOGIN (OAuth)
/// ─────────────────────────────
Route::get('auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);


/// ─────────────────────────────
/// 📨 INVITE & REGISTER VIA TOKEN
/// ─────────────────────────────
Route::post('/generate-register-link', [AuthController::class, 'generateRegisterLink']);
Route::get('/register/token-verify/{token}', [AuthController::class, 'verifyRegisterToken']);


/// ─────────────────────────────
/// 🔐 AUTHENTICATED USER ROUTES
/// ─────────────────────────────
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Get current user's allowed menus
    Route::get('/menus', [MenuController::class, 'getUserMenus']);
});


/// ─────────────────────────────
/// 🛠️ ADMIN PANEL ROUTES (Protected)
/// ─────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Role & Permission
    Route::get('/roles', [RoleController::class, 'getRoles']);
    Route::get('/role-permissions/{roleId}', [RoleController::class, 'getRolePermissions']);
    Route::get('/modules', [PermissionController::class, 'listModules']);
    Route::get('/modules-with-permissions', [PermissionController::class, 'getModulesWithPermissions']);
    Route::get('/permissions/grouped', [PermissionController::class, 'allGroupedPermissions']);

    // User Management
    Route::post('/invite-user', [UserController::class, 'inviteUser']);
    Route::get('/users', [UserController::class, 'listInvitedUsers']);

    // Menu Sorting & Sidebar Menus
    Route::post('/update-menu-order', [MenuController::class, 'updateSortOrder']);
    Route::get('/sidebar-menus', [AdminMenuController::class, 'getSidebarMenus']);
});


/// ─────────────────────────────
/// 📂 PROJECT MANAGEMENT (Kanban)
/// ─────────────────────────────
Route::middleware(['auth:sanctum'])->prefix('projects')->group(function () {

    // 📁 Project Routes
    Route::get('/', [ProjectController::class, 'index']);               // List all user projects
    Route::post('/', [ProjectController::class, 'store']);              // Create new project
    Route::put('/{project}', [ProjectController::class, 'update']);     // Update a project
    Route::delete('/{project}', [ProjectController::class, 'destroy']); // Delete a project

    // 📌 Board Routes (inside a project)
    Route::get('/{project}/boards', [BoardController::class, 'index']);         // List boards
    Route::post('/{project}/boards', [BoardController::class, 'store']);        // Create board
    Route::put('/boards/{board}', [BoardController::class, 'update']);          // Update board
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);      // Delete board
    Route::post('/boards/reorder', [BoardController::class, 'reorder']);        // Reorder boards (optional)

    // ✅ Task Routes (inside a board)
    Route::get('/boards/{board}/tasks', [TaskController::class, 'index']);      // List tasks
    Route::post('/boards/{board}/tasks', [TaskController::class, 'store']);     // Create task
    Route::put('/tasks/{task}', [TaskController::class, 'update']);             // Update task
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);         // Delete task
    Route::post('/tasks/reorder', [TaskController::class, 'reorder']);          // Reorder tasks (optional)
});
