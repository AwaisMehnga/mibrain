<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('display_name_encrypted')->nullable();
            $table->text('date_of_birth_encrypted')->nullable();
            $table->string('sex_at_birth', 32)->nullable();
            $table->string('gender_identity', 64)->nullable();
            $table->string('country_code', 2)->nullable()->index();
            $table->string('region_code', 64)->nullable();
            $table->string('timezone', 64)->nullable();
            $table->string('locale', 16)->nullable();
            $table->string('measurement_system', 16)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};