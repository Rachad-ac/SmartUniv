<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('salles', function (Blueprint $table) {
            $table->id('id_salle');
            $table->string('nom')->unique();
            $table->enum('type_salle', ['TP', 'Amphi', 'Cours']);
            $table->integer('capacite');
            $table->string('localisation');
            $table->enum('etat', ['Disponible', 'Occupée', 'Maintenance'])->default('Disponible');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('salles');
    }
};
