<?php
namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Model;

class BoardType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sort_order',
        'is_active',
    ];
}
