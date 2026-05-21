<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_triggers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trigger_id')->constrained('trigger_catalogs')->cascadeOnDelete();
            $table->text('custom_name_encrypted')->nullable();
            $table->string('confidence', 32)->default('suspected');
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'trigger_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_triggers');
    }
};
