<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_location_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('country_code', 2)->nullable();
            $table->string('region_code', 64)->nullable();
            $table->text('city_encrypted')->nullable();
            $table->text('postal_prefix_encrypted')->nullable();
            $table->decimal('latitude_rounded', 9, 4)->nullable();
            $table->decimal('longitude_rounded', 9, 4)->nullable();
            $table->string('precision_level', 32)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'country_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_location_preferences');
    }
};
