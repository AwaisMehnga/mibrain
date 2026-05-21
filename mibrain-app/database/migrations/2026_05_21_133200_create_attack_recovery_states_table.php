<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_recovery_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->string('state_code', 32);
            $table->timestamps();

            $table->index(['attack_id', 'state_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_recovery_states');
    }
};
