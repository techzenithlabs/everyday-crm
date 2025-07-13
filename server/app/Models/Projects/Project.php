<?php

namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Workspaces\Workspace;
use App\Models\Projects\Board;
use App\Models\Users\User;


class Project extends Model
{
    use HasFactory;

    const STATUS_ACTIVE = '1';
    const STATUS_ARCHIVED = '2';

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'status',
        'workspace_id',
    ];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function boards()
    {
        return $this->hasMany(Board::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
