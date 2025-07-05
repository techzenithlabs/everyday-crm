<?php

namespace App\Models\Roles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Models\Menus\Menu;
use App\Models\Roles\Role;

class Permission extends SpatiePermission
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
        'menu_id',
        'can_read',
        'can_write',
        'can_update',
        'can_delete',
    ];

    public function roles() : BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
