<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;
use App\Models\Users\User;

class UserInfo extends Model
{
    protected $fillable = ['user_id','phone','address','city','state','postal_code'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
