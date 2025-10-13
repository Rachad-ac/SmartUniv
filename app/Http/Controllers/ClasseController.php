<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class ClasseController extends Controller
{
    // Liste toutes les classes
    public function index()
    {
        $classes = Classe::with('filiere')->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des classes',
            'data'    => $classes
        ], 200);
    }

    // Créer une classe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'id_filiere' => 'required|exists:filieres,id_filiere',
            'niveau' => 'required|string|max:50',
        ]);

        $classe = Classe::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Classe créée avec succès',
            'data'    => $classe
        ], 201);
    }

    // Afficher une classe
    public function show($id)
    {
        try {
            $classe = Classe::with('filiere')->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Classe trouvée',
                'data' => $classe
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        }
    }

    // Modifier une classe
    public function update(Request $request, $id)
    {
        try {
            $classe = Classe::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'id_filiere' => 'sometimes|exists:filieres,id_filiere',
                'niveau' => 'sometimes|string|max:50',
            ]);

            $classe->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Classe mise à jour avec succès',
                'data' => $classe
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    // Supprimer une classe
    public function destroy($id)
    {
        try {
            $classe = Classe::findOrFail($id);
            $classe->delete();

            return response()->json([
                'success' => true,
                'message' => 'Classe supprimée avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        }
    }
}
