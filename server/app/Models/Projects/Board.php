<?php

namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Model;
use App\Models\Projects\Project;
use App\Models\Projects\Task;

class Board extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'sort_order', // You can rename this to position too for clarity
        'position',   // ✅ add this if not already
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }


    public function tasks()
    {
        return $this->hasMany(Task::class)->orderBy('position');
    }

    public function boardType()
    {
        return $this->belongsTo(BoardType::class);
    }
}
