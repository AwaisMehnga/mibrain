<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medication_id')->constrained('medication_catalogs')->cascadeOnDelete();
            $table->text('custom_name_encrypted')->nullable();
            $table->string('type', 32);
            $table->text('default_dose_encrypted')->nullable();
            $table->text('frequency_encrypted')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('prescriber_encrypted')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'medication_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_medications');
    }
};