<?php

namespace App\Models\Menus;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Spatie\Permission\Models\Permission;
use App\Models\Roles\Permission; // Assuming you have a Permission model in Roles namespace

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'path',
        'icon',
        'is_active',
        'sort_order',
        'parent_id',      // 👈 for hierarchy
        'breadcrumb',     // 👈 optional for frontend breadcrumb UI
    ];

    /**
     * Relationship: Children menus (submenu items)
     */
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Relationship: Parent menu (main menu if it's a submenu)
     */
    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * Optional: Permissions (for Spatie-based ACL)
     */
    public function permissions()
    {
        return $this->hasMany(Permission::class, 'menu_id'); // or 'menu_id' if you're using that
    }
}
