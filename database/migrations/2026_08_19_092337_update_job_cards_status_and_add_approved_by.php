<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_cards', function (Blueprint $table) {
            // First, change status to string to allow any value
            $table->string('status')->change();
        });
        
        // Update existing status values to match new enum
        DB::statement("UPDATE job_cards SET status = CASE 
            WHEN status = 'active' THEN 'pending'
            WHEN status = 'deactivated' THEN 'closed'
            ELSE 'pending'
        END");
        
        Schema::table('job_cards', function (Blueprint $table) {
            // Now change to new enum
            $table->enum('status', ['pending', 'in progress', 'completed', 'approved', 'closed'])->default('pending')->change();
            
            // Add approved_by column
            $table->foreignId('approved_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_cards', function (Blueprint $table) {
            // Drop approved_by column
            $table->dropForeign(['approved_by']);
            $table->dropColumn('approved_by');
            
            // Revert status enum
            $table->enum('status', ['active', 'deactivated'])->default('active')->change();
        });
    }
};
