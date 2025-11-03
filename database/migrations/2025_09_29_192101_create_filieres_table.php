<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('filieres', function (Blueprint $table) {
            $table->id('id_filiere');
            $table->string('nom', 100);
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        /**
         * 🔹 Table pivot entre utilisateurs (étudiants/enseignants) et filières
         * Permet de gérer les inscriptions et appartenances à une filière
         */
        Schema::create('user_filiere', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_filiere');
            $table->timestamps();

            // 🔹 Clés étrangères
            $table->foreign('id_user')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('id_filiere')
                ->references('id_filiere')->on('filieres')
                ->onDelete('cascade');

            // 🔹 Contrainte d’unicité (évite les doublons)
            $table->unique(['id_user', 'id_filiere']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('filieres');
        Schema::dropIfExists('user_filiere');
    }
};
