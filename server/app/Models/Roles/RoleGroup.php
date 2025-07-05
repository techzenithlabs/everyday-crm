<?php


namespace App\Models\Roles;

use Illuminate\Database\Eloquent\Model;

class RoleGroup extends Model
{
    protected $fillable = ['name'];

    public function roles()
    {
        return $this->hasMany(Role::class, 'role_group_id');
    }
}
