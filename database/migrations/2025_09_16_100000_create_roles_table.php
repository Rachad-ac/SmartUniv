<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('role', 50)->unique();
            $table->string('desc');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('roles');
    }
};
