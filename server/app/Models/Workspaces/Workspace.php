<?php

namespace App\Models\Workspaces;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    protected $fillable = ['name', 'description', 'created_by', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
