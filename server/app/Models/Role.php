<?php

namespace App\Models;

use App\Models\RoleGroup;
use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends SpatieRole
{
    use HasFactory;

    protected $fillable = ['name', 'guard_name', 'role_group_id'];

    public function group()
    {
        return $this->belongsTo(RoleGroup::class, 'role_group_id');
    }
}
