<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voice_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attack_id')->nullable()->constrained('attacks')->nullOnDelete();
            $table->unsignedBigInteger('storage_object_id')->nullable();
            $table->text('transcript_encrypted')->nullable();
            $table->json('parsed_fields')->nullable();
            $table->string('processing_status', 32)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['user_id', 'attack_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voice_notes');
    }
};
