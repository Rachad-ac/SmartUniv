<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Salle;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_salles' => Salle::count(),
            'reservations' => Reservation::count(),
            'admins' => User::where('role', 'Admin')->count(),
            'etudiants' => User::where('role', 'Etudiant')->count(),
            'enseignants' => User::where('role', 'Enseignant')->count(),
            'sallesNames' => Salle::pluck('nom'), 
            'reservationsPerSalle' => Salle::withCount('reservations')->pluck('reservations_count'), 
        ]);
    }

    public function latestUsers()
    {
        $users = User::orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(['id', 'nom', 'prenom', 'email', 'role', 'created_at']);

        return response()->json($users);
    }


}

