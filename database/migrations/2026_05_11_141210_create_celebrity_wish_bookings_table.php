<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('celebrity_wish_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number')->unique();
            $table->string('recipient_name');
            $table->string('occasion');
            $table->text('custom_message');
            $table->string('from_name');
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('fulfillment_status')->default('pending'); // pending, in_progress, completed
            $table->string('delivered_video_url')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('celebrity_wish_bookings'); }
};