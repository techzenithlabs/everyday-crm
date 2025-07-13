<?php

namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Model;
use App\Models\Projects\Board;
use App\Models\Users\User;

class Task extends Model
{
    protected $fillable = [
        'board_id',
        'title',
        'description',
        'assigned_to',
        'due_date',
        'sort_order',
        'status',
        'priority',
        'labels',
        'attachments',
        'is_archived',
        'created_by',
    ];

    protected $casts = [
        'labels' => 'array',
        'attachments' => 'array',
        'due_date' => 'datetime',
        'is_archived' => 'boolean',
    ];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
