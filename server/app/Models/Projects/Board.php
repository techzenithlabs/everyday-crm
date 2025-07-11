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
        'sort_order',
        'created_by', // Optional, if used
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }


    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

}
