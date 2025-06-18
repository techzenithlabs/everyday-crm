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
    protected $fillable = [
        'token',
        'first_name',
        'last_name',
        'email',
        'role_id',
        'used',
        'expires_at',
        'created_at',
        'updated_at',
    ];
}
