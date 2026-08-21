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
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['status', 'reported_at', 'attended_at', 'cleared_at']);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
            $table->enum('status', ['pending', 'in progress', 'completed'])->default('pending');
            $table->date('reported_at')->nullable();
            $table->date('attended_at')->nullable();
            $table->date('cleared_at')->nullable();
        });
    }
};
