<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('environmental_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('observation_at')->nullable();
            $table->string('source', 64)->nullable();
            $table->decimal('barometric_pressure', 8, 2)->nullable();
            $table->decimal('pressure_change_24h', 8, 2)->nullable();
            $table->decimal('temperature', 8, 2)->nullable();
            $table->decimal('humidity', 8, 2)->nullable();
            $table->unsignedSmallInteger('air_quality_index')->nullable();
            $table->unsignedSmallInteger('light_exposure_estimate')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'observation_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('environmental_observations');
    }
};
