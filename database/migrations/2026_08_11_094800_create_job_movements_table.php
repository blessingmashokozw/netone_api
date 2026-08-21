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
        Schema::create('job_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_cards')->onDelete('cascade');
            $table->string('departure_location_id');
            $table->timestamp('departure_time');
            $table->integer('departure_mileage');
            $table->string('arrival_location_id')->nullable();
            $table->timestamp('arrival_time')->nullable();
            $table->integer('arrival_mileage')->nullable();
            $table->decimal('departure_latitude', 10, 8)->nullable();
            $table->decimal('departure_longitude', 11, 8)->nullable();
            $table->decimal('arrival_latitude', 10, 8)->nullable();
            $table->decimal('arrival_longitude', 11, 8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_movements');
    }
};
