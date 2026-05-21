<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_aura_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->foreignId('aura_type_id')->constrained('aura_types')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['attack_id', 'aura_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_aura_types');
    }
};
