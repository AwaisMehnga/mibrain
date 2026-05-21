<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_checkins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('checkin_date');
            $table->decimal('sleep_hours', 4, 1)->nullable();
            $table->string('sleep_quality', 32)->nullable();
            $table->string('hydration_status', 32)->nullable();
            $table->string('meal_status', 32)->nullable();
            $table->unsignedTinyInteger('stress_level')->nullable();
            $table->unsignedTinyInteger('energy_level')->nullable();
            $table->unsignedSmallInteger('cycle_day')->nullable();
            $table->text('notes_encrypted')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'checkin_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_checkins');
    }
};
