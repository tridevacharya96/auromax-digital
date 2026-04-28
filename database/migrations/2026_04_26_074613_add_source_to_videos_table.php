<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('videos', function (Blueprint $table) {
            $table->string('source')->default('manual')->after('is_active'); // 'manual' or 'youtube'
            $table->string('youtube_published_at')->nullable()->after('source');
        });
    }
    public function down(): void {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['source', 'youtube_published_at']);
        });
    }
};