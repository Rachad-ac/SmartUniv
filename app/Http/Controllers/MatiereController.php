<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class MatiereController extends Controller
{
    /**
     * Lister toutes les matières
     */
    public function index()
    {
        try {
            $matieres = Matiere::orderBy('nom')->with('cours')->get();
            return response()->json([
                'success' => true,
                'message' => 'Liste des matières',
                'data'    => $matieres,
                'count'   => $matieres->count()
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Créer une nouvelle matière
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'         => 'required|string|max:255',
            'code'        => 'nullable|string|max:50|unique:matieres,code',
            'description' => 'nullable|string'
        ]);

        $matiere = Matiere::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Matière créée avec succès',
            'data'    => $matiere
        ], 201);
    }

    /**
     * Afficher une matière spécifique
     */
    public function show($id)
    {
        try {
            $matiere = Matiere::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $matiere
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matière non trouvée'
            ], 404);
        }
    }

    /**
     * Mettre à jour une matière
     */
    public function update(Request $request, $id)
    {
        try {
            $matiere = Matiere::findOrFail($id);

            $validated = $request->validate([
                'nom'         => 'sometimes|required|string|max:255',
                'code'        => 'nullable|string|max:50|unique:matieres,code,' . $id . ',id_matiere',
                'description' => 'nullable|string'
            ]);

            $matiere->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Matière mise à jour avec succès',
                'data'    => $matiere
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matière non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Supprimer une matière
     */
    public function destroy($id)
    {
        try {
            $matiere = Matiere::findOrFail($id);
            $matiere->delete();

            return response()->json([
                'success' => true,
                'message' => 'Matière supprimée avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matière non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Rechercher des matières par nom ou code
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        $matieres = Matiere::where('nom', 'LIKE', "%{$query}%")
                           ->orWhere('code', 'LIKE', "%{$query}%")
                           ->orderBy('nom')
                           ->get();

        return response()->json([
            'success' => true,
            'data'    => $matieres,
            'count'   => $matieres->count()
        ]);
    }
}
