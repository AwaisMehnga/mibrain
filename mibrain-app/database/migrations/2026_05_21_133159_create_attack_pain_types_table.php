<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_pain_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->foreignId('pain_type_id')->constrained('pain_types')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['attack_id', 'pain_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_pain_types');
    }
};
