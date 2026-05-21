<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regional_compliance_rules', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 2);
            $table->string('region_code', 64)->nullable();
            $table->boolean('requires_explicit_health_consent')->default(false);
            $table->boolean('requires_data_residency')->default(false);
            $table->unsignedInteger('default_retention_days')->nullable();
            $table->unsignedTinyInteger('minor_age_threshold')->nullable();
            $table->string('privacy_policy_version', 32)->nullable();
            $table->string('terms_version', 32)->nullable();
            $table->timestamps();

            $table->foreign('country_code')->references('code')->on('countries')->cascadeOnDelete();
            $table->index(['country_code', 'region_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regional_compliance_rules');
    }
};
