<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('priority')->default('medium')->after('status'); // low, medium, high
            $table->json('labels')->nullable()->after('priority');
            $table->json('attachments')->nullable()->after('labels');
            $table->boolean('is_archived')->default(false)->after('attachments');
            $table->unsignedBigInteger('created_by')->after('is_archived');

            // Foreign key
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'priority',
                'labels',
                'attachments',
                'is_archived',
                'created_by',
            ]);
        });
    }
};
