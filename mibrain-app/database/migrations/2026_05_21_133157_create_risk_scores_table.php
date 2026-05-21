<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('score_date');
            $table->decimal('score', 5, 2);
            $table->string('level', 32);
            $table->string('model_version', 32)->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->text('explanation_summary')->nullable();
            $table->string('data_sufficiency', 32)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'score_date', 'model_version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_scores');
    }
};
