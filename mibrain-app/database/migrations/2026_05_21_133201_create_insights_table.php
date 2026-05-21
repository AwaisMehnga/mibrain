<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('insight_type', 64);
            $table->string('title');
            $table->text('summary');
            $table->string('confidence', 32)->nullable();
            $table->string('model_version', 32)->nullable();
            $table->string('status', 32)->default('active');
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'insight_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insights');
    }
};
