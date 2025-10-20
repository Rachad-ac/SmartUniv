<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class EquipementController extends Controller
{
    public function index()
    {
        $equipements = Equipement::all();

        return response()->json([
            'success' => true,
            'message' => 'Liste des équipements',
            'data' => $equipements
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'id_salle' => 'required|exists:salles,id_salle',
        ]);

        $equipement = Equipement::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Équipement créé avec succès',
            'data' => $equipement
        ], 201);
    }

    public function show($id)
    {
        try {
            $equipement = Equipement::where('id_salle' , $id)->get();

            return response()->json([
                'success' => true,
                'message' => 'Équipement trouvé',
                'data' => $equipement
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Équipement non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $equipement = Equipement::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'quantite' => 'sometimes|required|integer|min:1',
                'description' => 'nullable|string',
                'id_salle' => 'sometimes|required|exists:salles,id_salle',
            ]);

            $equipement->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Équipement mis à jour avec succès',
                'data' => $equipement
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Équipement non trouvé'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $equipement = Equipement::findOrFail($id);
            $equipement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Équipement supprimé avec succès'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Équipement non trouvé'
            ], 404);
        }
    }

    /**
     * Recherche filtrée d'utilisateurs.
     * GET /api/equipement/search?nom=&quantite=&description=
     */
    public function search(Request $request)
    {
        $equipement = Equipement::query();

        if ($request->filled('nom')) {
            $equipement->where('nom', 'LIKE', '%' . $request->nom . '%');
        }
        if ($request->filled('quantite')) {
            $equipement->where('quantite', 'LIKE', '%' . $request->quantite . '%');
        }
        if ($request->filled('description')) {
            $equipement->where('description', 'LIKE', '%' . $request->description . '%');
        }

        return response()->json(['success' => true, 'data' => $equipement->get()], 200);
    }

}
