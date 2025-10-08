<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plannings', function (Blueprint $table) {
            $table->id('id_planning');
            $table->unsignedBigInteger('id_cours')->nullable();
            $table->unsignedBigInteger('id_salle')->nullable();
            $table->unsignedBigInteger('id_classe')->nullable();
            $table->unsignedBigInteger('id_user');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->string('description')->nullable();
            $table->timestamps();

            // 🔹 Clés étrangères
            $table->foreign('id_cours')->references('id_cours')->on('cours')->onDelete('set null');
            $table->foreign('id_salle')->references('id_salle')->on('salles')->onDelete('set null');
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_classe')->references('id_classe')->on('classes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plannings');
    }
};
