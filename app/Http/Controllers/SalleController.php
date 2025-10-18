<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class SalleController extends Controller
{
   // Liste de toutes les salles
    public function index()
    {
        // 1. Utiliser le chargement anticipé (Eager Loading) 'with' 
        //    pour récupérer les salles ET toutes leurs relations en une seule requête optimisée (éviter le N+1).

        $salles = Salle::with([    // Assurez-vous que cette relation existe
            'reservations',  // Assurez-vous que cette relation existe
            'equipements',   // Assurez-vous que cette relation existe
                 // Assurez-vous que cette relation existe
        ])->get();

        // 2. Retourner la réponse JSON avec les données chargées
        return response()->json([
            'success' => true,
            'message' => 'Liste des salles',
            'data' => $salles
        ], 200);
    }

    // Ajouter une nouvelle salle
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'type_salle' => 'required|in:TP,Amphi,Cours',
            'capacite' => 'required|integer|min:1',
            'localisation' => 'required|string|max:150',
            'etat' => 'sometimes|in:Disponible,Occupee,Maintenance',
            'photo' => 'sometimes|string|max:255',
        ]);

        $salle = Salle::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Salle créée avec succès',
            'data' => $salle
        ], 201);
    }

    // Voir une salle précise
    public function show($id)
    {
        try {
            $salle = Salle::where('id_salle', $id)->with('equipements')->firstOrFail();
            return response()->json([
                'success' => true,
                'message' => 'Salle trouvée',
                'data' => $salle
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        }
    }

    // Modifier une salle
    public function update(Request $request, $id)
    {
        try {
            $salle = Salle::where('id_salle', $id)->firstOrFail();

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'type_salle' => 'sometimes|in:TP,Amphi,Cours',
                'capacite' => 'sometimes|integer|min:1',
                'localisation' => 'sometimes|string|max:150',
                'etat' => 'sometimes|in:Disponible,Occupee,Maintenance',
                'photo' => 'sometimes|string|max:255',
            ]);

            $salle->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Salle mise à jour avec succès',
                'data' => $salle
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        }
    }

    // Recherche filtrée
    public function search(Request $request)
    {
        $query = Salle::query();

        if ($request->filled('nom')) {
            $query->where('nom', 'like', '%' . $request->nom . '%');
        }

        if ($request->filled('type_salle')) {
            $query->where('type_salle', $request->type_salle);
        }

        if ($request->filled('capacite')) {
            $query->where('capacite', '>=', $request->capacite);
        }

        return response()->json([
            'success' => true,
            'message' => 'Résultats de recherche',
            'data' => $query->get()
        ], 200);
    }

    // Supprimer une salle
    public function destroy($id)
    {
        try {
            $salle = Salle::where('id_salle', $id)->firstOrFail();
            $salle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Salle supprimée avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
