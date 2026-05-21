<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('auth_provider')->nullable()->after('id');
            $table->string('auth_provider_user_id')->nullable()->after('auth_provider');
            $table->text('email_encrypted')->nullable()->after('email');
            $table->text('phone_encrypted')->nullable()->after('email_encrypted');
            $table->timestamp('phone_verified_at')->nullable()->after('phone_encrypted');
            $table->string('status')->default('active')->after('phone_verified_at');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'auth_provider',
                'auth_provider_user_id',
                'email_encrypted',
                'phone_encrypted',
                'phone_verified_at',
                'status',
            ]);
        });
    }
};
