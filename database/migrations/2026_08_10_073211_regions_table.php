<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('status', ['active', 'deactivated'])->default('active');
            $table->timestamps();
        });

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('status', ['pending', 'in progress', 'completed'])->default('pending');

            $table->date('reported_at')->nullable();
            $table->date('attended_at')->nullable();
            $table->date('cleared_at')->nullable();
            $table->timestamps();
        });

        Schema::create('job_cards', function (Blueprint $table) {
            $table->id();
            $table->longText('description');
            $table->integer('region_id');
            $table->integer('given_to')->nullable();
            $table->longText( 'work_perfomed')->nullable();
            $table->enum('status', ['active', 'deactivated'])->default('active');
            $table->longText('comments');
            $table->timestamps();
        });

        Schema::create('job_vehicles', function (Blueprint $table) {
            $table->id();
            $table->integer('job_id');
            $table->string('vehicle_number');
            $table->integer('mileage');
            $table->integer('fuel_drawn')->default(0);
            $table->timestamps();
        });


        Schema::create('job_movements', function (Blueprint $table) {
            $table->id();
            $table->integer('job_id');
            $table->string('location_id');
            $table->longText('cordinates')->nullable();
            $table->enum('type', ['departure', 'arrival']);
            $table->integer('mileage');
            $table->dateTime('time');
            $table->timestamps();
        });

        Schema::create('job_site_status', function (Blueprint $table) {
            $table->id();
            $table->integer('job_id');
            $table->integer('site_name');
            $table->string('site_item_id');
            $table->integer('status');
            $table->timestamps();
        });

        Schema::create('site_items', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('data_type');
            $table->boolean('optional');
            $table->boolean('is_active');
            $table->timestamps();
        });

        Schema::create('job_approvals', function (Blueprint $table) {
            $table->id();
            $table->integer('job_id');
            $table->integer('user_id');
            $table->enum('status', ['approved', 'pending', 'not approved'])->default('pending');
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regions');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('job_cards');
        Schema::dropIfExists('job_vehicles');
        Schema::dropIfExists('job_movements');
        Schema::dropIfExists('job_site_status');
        Schema::dropIfExists('site_items');
        Schema::dropIfExists('job_approvals');
    }
};
