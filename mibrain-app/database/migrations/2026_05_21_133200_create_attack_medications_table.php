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
        Schema::create('attack_medications', function (Blueprint $table) {
            $table->id();

    /**
     * Reverse the migrations.
     */
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->foreignId('user_medication_id')->nullable()->constrained('user_medications')->nullOnDelete();
            $table->text('custom_medication_name_encrypted')->nullable();
            $table->text('dose_encrypted')->nullable();
            $table->timestamp('taken_at')->nullable();
            $table->string('effectiveness', 32)->nullable();
            $table->text('side_effects_encrypted')->nullable();
            $table->timestamps();

            $table->index(['attack_id', 'taken_at']);
        });
    }
};
