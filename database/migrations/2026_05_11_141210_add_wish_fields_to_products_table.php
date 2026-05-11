<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_celebrity_wish')->default(false)->after('is_featured');
            $table->string('celebrity_name')->nullable()->after('is_celebrity_wish');
            $table->string('celebrity_photo')->nullable()->after('celebrity_name');
            $table->integer('delivery_days')->default(3)->after('celebrity_photo');
            $table->json('sample_videos')->nullable()->after('delivery_days'); // array of youtube IDs
        });
    }
    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_celebrity_wish','celebrity_name','celebrity_photo','delivery_days','sample_videos']);
        });
    }
};