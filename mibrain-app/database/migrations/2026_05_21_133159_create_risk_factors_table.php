<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_factors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_score_id')->constrained('risk_scores')->cascadeOnDelete();
            $table->string('factor_type', 32);
            $table->string('label');
            $table->decimal('impact', 8, 2)->nullable();
            $table->string('direction', 32)->nullable();
            $table->text('explanation')->nullable();
            $table->timestamps();

            $table->index(['risk_score_id', 'factor_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_factors');
    }
};
