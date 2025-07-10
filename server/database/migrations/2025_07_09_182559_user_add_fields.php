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
        Schema::table('users', function (Blueprint $table) {
        $table->char('token', 36)->nullable()->after('email'); // nullable in case token isn't always needed
        $table->timestamp('expires_at')->nullable()->after('remember_token'); // ✅ avoid default error
        $table->tinyInteger('used')->default(0)->after('expires_at');
        $table->tinyInteger('is_registerd')->default(0)->after('used');
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
