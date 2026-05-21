<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_triggers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attack_id')->constrained('attacks')->cascadeOnDelete();
            $table->foreignId('trigger_id')->constrained('trigger_catalogs')->cascadeOnDelete();
            $table->text('custom_trigger_text_encrypted')->nullable();
            $table->string('confidence', 32)->nullable();
            $table->timestamps();

            $table->unique(['attack_id', 'trigger_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_triggers');
    }
};
