<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlanningController extends Controller
{
    /**
     * Helper pour formater un planning Eloquent pour FullCalendar.
     */
    protected function formatEventForFullCalendar(Planning $planning)
    {
        // Supposons que vos modèles Salle, Classe, User et Cours ont un champ 'nom' ou 'titre'
        return [
            'id' => $planning->id_planning,
            'title' => $planning->cours->titre . ' - ' . $planning->classe->nom . ' (' . $planning->salle->nom . ')',
            'start' => $planning->date_debut,
            'end' => $planning->date_fin,
            'extendedProps' => [
                'salle_nom' => $planning->salle->nom,
                'classe_nom' => $planning->classe->nom,
                'cours_id' => $planning->id_cours,
                'filiere_nom' => $planning->classe->filiere->nom,
                'user_id' => $planning->id_user,
                'description' => $planning->description,
            ],
            // Vous pouvez définir des couleurs en fonction de la salle, du cours, etc.
            'color' => $this->getDynamicColor($planning->id_cours), 
        ];
    }

    /**
     * Méthode simple de couleur dynamique basée sur un ID.
     */
    protected function getDynamicColor($id)
    {
        $colors = ['#4287f5', '#f54298', '#42f560', '#f5bc42'];
        return $colors[$id % count($colors)];
    }

    /**
     * Affiche une liste de plannings, avec filtrage optionnel.
     */
    public function index(Request $request)
    {
        $query = Planning::with(['cours', 'salle', 'classe', 'user']);

        // --- Logique de Filtrage (Exemples) ---

        if ($request->filled('id_classe')) {
            $query->where('id_classe', $request->id_classe);
        }

        if ($request->filled('id_cours')) {
            $query->where('id_cours', $request->id_cours);
        }

        // Ajoutez ici d'autres filtres (id_filiere, id_salle, id_user, etc.)
        // Pour filtrer par filière, vous devrez utiliser whereHas sur la relation classe :
        if ($request->filled('id_filiere')) {
             $query->whereHas('classe.filiere', fn ($q) => $q->where('id_filiere', $request->id_filiere));
         }

        $plannings = $query->get();

        $events = $plannings->map(fn($p) => $this->formatEventForFullCalendar($p));

        return response()->json([
            'message' => 'Liste des plannings chargée',
            'data' => $events,
        ]);
    }

    /**
     * Ajout d'un nouveau planning (CREATE).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_cours' => 'required|exists:cours,id_cours',
            'id_salle' => 'required|exists:salles,id_salle',
            'id_classe' => 'required|exists:classes,id_classe',
            'id_user' => 'required|exists:users,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérification des conflits de réservation (salle et enseignant)
        $data = $validator->validated();
        $conflitSalle = Planning::where('id_salle', $data['id_salle'])
            ->where(function($q) use ($data) {
                $q->whereBetween('date_debut', [$data['date_debut'], $data['date_fin']])
                  ->orWhereBetween('date_fin', [$data['date_debut'], $data['date_fin']])
                  ->orWhere(function($q2) use ($data) {
                      $q2->where('date_debut', '<', $data['date_debut'])
                         ->where('date_fin', '>', $data['date_fin']);
                  });
            })
            ->exists();

        $conflitUser = Planning::where('id_user', $data['id_user'])
            ->where(function($q) use ($data) {
                $q->whereBetween('date_debut', [$data['date_debut'], $data['date_fin']])
                  ->orWhereBetween('date_fin', [$data['date_debut'], $data['date_fin']])
                  ->orWhere(function($q2) use ($data) {
                      $q2->where('date_debut', '<', $data['date_debut'])
                         ->where('date_fin', '>', $data['date_fin']);
                  });
            })
            ->exists();

        if ($conflitSalle) {
            return response()->json(['error' => 'Conflit : la salle est déjà réservée sur ce créneau.'], 409);
        }
        if ($conflitUser) {
            return response()->json(['error' => 'Conflit : l’enseignant est déjà occupé sur ce créneau.'], 409);
        }

        $planning = Planning::create($data);
        $planning->load(['cours', 'salle', 'classe', 'user']);

        return response()->json($this->formatEventForFullCalendar($planning), 201);
    }

    /**
     * Mise à jour d'un planning existant (UPDATE).
     */
    public function update(Request $request, Planning $planning)
    {
        $validator = Validator::make($request->all(), [
            'id_cours' => 'sometimes|required|exists:cours,id_cours',
            'id_salle' => 'sometimes|required|exists:salles,id_salle',
            'id_classe' => 'sometimes|required|exists:classes,id_classe',
            'id_user' => 'sometimes|required|exists:users,id',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after:date_debut',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérification des conflits de réservation (salle et enseignant), en excluant le planning actuel
        $data = $validator->validated();
        $conflitSalle = Planning::where('id_salle', $data['id_salle'] ?? $planning->id_salle)
            ->where('id_planning', '!=', $planning->id_planning)
            ->where(function($q) use ($data, $planning) {
                $dateDebut = $data['date_debut'] ?? $planning->date_debut;
                $dateFin = $data['date_fin'] ?? $planning->date_fin;
                $q->whereBetween('date_debut', [$dateDebut, $dateFin])
                  ->orWhereBetween('date_fin', [$dateDebut, $dateFin])
                  ->orWhere(function($q2) use ($dateDebut, $dateFin) {
                      $q2->where('date_debut', '<', $dateDebut)
                         ->where('date_fin', '>', $dateFin);
                  });
            })
            ->exists();

        $conflitUser = Planning::where('id_user', $data['id_user'] ?? $planning->id_user)
            ->where('id_planning', '!=', $planning->id_planning)
            ->where(function($q) use ($data, $planning) {
                $dateDebut = $data['date_debut'] ?? $planning->date_debut;
                $dateFin = $data['date_fin'] ?? $planning->date_fin;
                $q->whereBetween('date_debut', [$dateDebut, $dateFin])
                  ->orWhereBetween('date_fin', [$dateDebut, $dateFin])
                  ->orWhere(function($q2) use ($dateDebut, $dateFin) {
                      $q2->where('date_debut', '<', $dateDebut)
                         ->where('date_fin', '>', $dateFin);
                  });
            })
            ->exists();

        if ($conflitSalle) {
            return response()->json(['error' => 'Conflit : la salle est déjà réservée sur ce créneau.'], 409);
        }
        if ($conflitUser) {
            return response()->json(['error' => 'Conflit : l’enseignant est déjà occupé sur ce créneau.'], 409);
        }

        $planning->update($data);
        $planning->load(['cours', 'salle', 'classe', 'user']);

        return response()->json($this->formatEventForFullCalendar($planning));
    }

    /**
     * Suppression d'un planning (DELETE).
     */
    public function destroy(Planning $planning)
    {
        $planning->delete();
        return response()->json(['message' => 'Planning supprimé avec succès.'], 200);
    }
}