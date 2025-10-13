<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('classes', function (Blueprint $table) {
            $table->id('id_classe');
            $table->string('nom');
            $table->string('niveau');
            $table->integer('effectif')->nullable();

            $table->unsignedBigInteger('id_filiere');
            $table->foreign('id_filiere')->references('id_filiere')->on('filieres')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('user_classe', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_classe');
            $table->timestamps();

            // 🔹 Clés étrangères
            $table->foreign('id_user')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('id_classe')
                ->references('id_classe')->on('classes')
                ->onDelete('cascade');

            // 🔹 Contrainte d’unicité
            $table->unique(['id_user', 'id_classe']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('classes');
        Schema::dropIfExists('user_classe');
    }
};
