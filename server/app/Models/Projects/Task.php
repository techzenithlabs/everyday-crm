<?php

namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Model;
use App\Models\Projects\Board;

class Task extends Model
{
    public function board()
    {
        return $this->belongsTo(Board::class);
    }
}
