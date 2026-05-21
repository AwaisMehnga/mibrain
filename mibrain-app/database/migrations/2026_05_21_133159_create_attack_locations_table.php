<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->string('location_code', 32);
            $table->timestamps();

            $table->index(['attack_id', 'location_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_locations');
    }
};
