<?php

namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Users\User;

class Project extends Model
{
     use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'status',
    ];

     public function boards()
    {
        return $this->hasMany(Board::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
