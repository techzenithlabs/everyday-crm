<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Projects\BoardType;

class BoardTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Jobs Board', 'slug' => 'jobs-board', 'sort_order' => 1],
            ['name' => 'Permits Board', 'slug' => 'permits-board', 'sort_order' => 2],
        ];

        foreach ($types as $type) {
            BoardType::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
