<?php

/**
 * App\Models\User
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Permission> $permissions
 * @property-read \App\Models\Role|null $role
 */

namespace App\Models\Users;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Roles\Role;
use App\Models\Roles\Permission;
use App\Models\Users\UserPermission;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Users\UserInfo;
use App\Models\Workspaces\Workspace;

/**
 * @method \Illuminate\Database\Eloquent\Relations\BelongsToMany workspaces()
 */

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = true; // ✅ Enable timestamps

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'role_id',
        'status',
        'password',
        'token',       // 'permissions',
        'used',
        'is_registered',
        'remember_token',
        'expires_at',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function workspaces()
    {
        return $this->belongsToMany(Workspace::class, 'workspace_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function info()
    {
        return $this->hasOne(UserInfo::class);
    }

    public function userPermissions()
    {
        return $this->hasOne(UserPermission::class);
    }
}
