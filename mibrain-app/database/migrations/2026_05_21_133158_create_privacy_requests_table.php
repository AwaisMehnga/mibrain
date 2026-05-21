<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('privacy_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('request_type', 32);
            $table->string('status', 32);
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('verification_method', 64)->nullable();
            $table->text('notes_internal')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'request_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('privacy_requests');
    }
};