<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insight_evidence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('insight_id')->constrained('insights')->cascadeOnDelete();
            $table->string('entity_type', 64);
            $table->string('entity_id', 64);
            $table->string('evidence_label');
            $table->decimal('weight', 8, 4)->nullable();
            $table->timestamps();

            $table->index(['insight_id', 'entity_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insight_evidence');
    }
};
