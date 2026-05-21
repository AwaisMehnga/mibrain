<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('condition_id')->constrained('condition_catalogs')->cascadeOnDelete();
            $table->string('source', 32)->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'condition_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_conditions');
    }
};