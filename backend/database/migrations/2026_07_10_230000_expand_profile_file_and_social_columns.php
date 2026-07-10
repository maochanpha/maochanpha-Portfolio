<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->text('profile_photo')->nullable()->change();
            $table->text('cv_file')->nullable()->change();
            $table->text('github_url')->nullable()->change();
            $table->text('linkedin_url')->nullable()->change();
            $table->text('facebook_url')->nullable()->change();
            $table->text('telegram_url')->nullable()->change();
            $table->text('instagram_url')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('profile_photo')->nullable()->change();
            $table->string('cv_file')->nullable()->change();
            $table->string('github_url')->nullable()->change();
            $table->string('linkedin_url')->nullable()->change();
            $table->string('facebook_url')->nullable()->change();
            $table->string('telegram_url')->nullable()->change();
            $table->string('instagram_url')->nullable()->change();
        });
    }
};
