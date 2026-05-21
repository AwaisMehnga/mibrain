<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shared_report_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_report_id')->constrained('doctor_reports')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token_hash', 128)->unique();
            $table->string('access_scope', 32);
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamps();

            $table->index(['doctor_report_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_report_links');
    }
};
