<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('service_key')->unique();
            $table->unsignedSmallInteger('slot_minutes')->default(60);
            $table->unsignedTinyInteger('start_hour')->default(8);
            $table->unsignedTinyInteger('end_hour')->default(18);
            $table->unsignedSmallInteger('max_per_day')->default(5);
            $table->unsignedSmallInteger('gap_minutes')->default(0);
            $table->time('last_slot_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_settings');
    }
};
