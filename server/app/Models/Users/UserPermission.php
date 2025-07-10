<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;
use App\Models\Users\User;

class UserPermission extends Model
{

    protected $casts = [
        'permissions' => 'array',
    ];

    protected $fillable = [
        'user_id',
        'permissions', // e.g., {"1": [], "2": [3, 4]}
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
