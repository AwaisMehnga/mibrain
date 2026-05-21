<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_symptoms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->foreignId('symptom_id')->constrained('symptoms')->cascadeOnDelete();
            $table->unsignedTinyInteger('severity')->nullable();
            $table->timestamps();

            $table->unique(['attack_id', 'symptom_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_symptoms');
    }
};
