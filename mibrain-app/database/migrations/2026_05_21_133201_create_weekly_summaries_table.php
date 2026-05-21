<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('week_start_date');
            $table->date('week_end_date');
            $table->unsignedSmallInteger('attack_count')->nullable();
            $table->decimal('average_severity', 5, 2)->nullable();
            $table->string('best_day', 32)->nullable();
            $table->string('worst_day', 32)->nullable();
            $table->text('summary_text')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'week_start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_summaries');
    }
};
