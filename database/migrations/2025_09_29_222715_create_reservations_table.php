<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('id_reservation');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->enum('type_reservation', ['Cours', 'Examen', 'Evenement', 'TP']);
            $table->enum('statut', ['En attente', 'Validée', 'Refusée', 'Annulée'])->default('En attente');
            $table->string('motif')->nullable();

            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_salle');
            $table->unsignedBigInteger('id_cours')->nullable();
            $table->unsignedBigInteger('id_filiere')->nullable();
            $table->unsignedBigInteger('id_classe')->nullable();

            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_salle')->references('id_salle')->on('salles')->onDelete('cascade');
            $table->foreign('id_cours')->references('id_cours')->on('cours')->onDelete('set null');
            $table->foreign('id_filiere')->references('id_filiere')->on('filieres')->onDelete('set null');
            $table->foreign('id_classe')->references('id_classe')->on('classes')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('reservations');
    }
};
