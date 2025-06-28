<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInvitation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'user_invitations';
    protected $primaryKey = 'id';
    public $timestamps = true; // ✅ Enable timestamps
    protected $fillable = [
        'token',
        'first_name',
        'last_name',
        'email',
        'role_id',
        'permissions',
        'used',
        'expires_at',
    ];
    protected $casts = [
        'permissions' => 'array',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
