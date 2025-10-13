<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Salle;
use Illuminate\Http\Request;
use App\Models\Role; // 💡 J'ai ajouté l'importation du modèle Role si nécessaire pour des opérations futures

class DashboardController extends Controller
{
    /**
     * Récupère les statistiques du tableau de bord.
     * Utilise whereHas() pour filtrer les utilisateurs par nom de rôle.
     */
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_salles' => Salle::count(),
            'reservations' => Reservation::count(),
            
            // ✅ CORRECTION : Utilise whereHas sur la relation 'role' pour filtrer par nom (table roles)
            'admins' => User::whereHas('role', function ($query) {
                $query->where('nom', 'Admin');
            })->count(),
            
            'etudiants' => User::whereHas('role', function ($query) {
                // Correction de la faute de frappe ('role.') et utilise le nom du rôle
                $query->where('nom', 'Etudiant');
            })->count(),
            
            'enseignants' => User::whereHas('role', function ($query) {
                $query->where('nom', 'Enseignant');
            })->count(),

            'chef_filiere' => User::whereHas('role', function ($query) {
                $query->where('nom', 'Chef-filiere');
            })->count(),

            'assistante' => User::whereHas('role', function ($query) {
                $query->where('nom', 'Assistante');
            })->count(),
            
            'sallesNames' => Salle::pluck('nom'), 
            'reservationsPerSalle' => Salle::withCount('reservations')->pluck('reservations_count'), 
        ]);
    }

    //---------------------------------------------------------------------

    /**
     * Récupère les 5 derniers utilisateurs inscrits, avec leur rôle chargé.
     * La colonne 'role_id' est utilisée dans le select (car elle existe), 
     * et la relation 'role' est chargée avec with().
     */
    public function latestUsers()
    {
        $users = User::with('role')
                     ->orderBy('date_inscription', 'desc')
                     ->take(5)
                     // ✅ CORRECTION : Enlève le point '.' de 'role_id.'
                     ->get(['id', 'nom', 'prenom', 'email', 'role_id', 'date_inscription']);

        // Le nom du rôle sera accessible via user.role.nom dans le frontend (Angular/JS)
        return response()->json($users);
    }
}