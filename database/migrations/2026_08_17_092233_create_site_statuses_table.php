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
        Schema::create('site_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_cards')->onDelete('cascade');
            $table->foreignId('site_item_id')->constrained('site_items')->onDelete('cascade');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->text('value');
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->unique(['job_id', 'site_item_id', 'location_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_statuses');
    }
};
