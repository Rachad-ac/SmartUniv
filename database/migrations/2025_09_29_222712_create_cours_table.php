<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cours', function (Blueprint $table) {
            $table->id('id_cours');
            $table->string('nom');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('semestre')->nullable();
            $table->integer('volume_horaire')->default(0);

            $table->unsignedBigInteger('id_matiere');
            $table->unsignedBigInteger('id_filiere');

            $table->foreign('id_matiere')->references('id_matiere')->on('matieres')->onDelete('cascade');
            $table->foreign('id_filiere')->references('id_filiere')->on('filieres')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('cours_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cours_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // 🔹 Clés étrangères
            $table->foreign('cours_id')
                ->references('id_cours')->on('cours')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            // 🔹 Contrainte d’unicité
            $table->unique(['cours_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('cours');
        Schema::dropIfExists('cours_user');
    }
};
