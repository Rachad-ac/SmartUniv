<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class CoursController extends Controller
{
    public function index(Request $request)
    {
        $query = Cours::with(['matiere', 'filiere'])->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('matiere_id')) {
            $query->where('id_matiere', (int) $request->input('matiere_id'));
        }

        $cours = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des cours',
            'data' => $cours
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:cours,code',
            'description' => 'nullable|string',
            'id_matiere' => 'required|exists:matieres,id_matiere',
            'id_filiere' => 'required|exists:filieres,id_filiere',
        ]);

        $cours = Cours::create($validated);
        $cours->load(['matiere', 'filiere']);

        return response()->json([
            'success' => true,
            'message' => 'Cours créé avec succès',
            'data' => $cours
        ], 201);
    }

    public function show($id)
    {
        try {
            $cours = Cours::with(['matiere', 'filiere'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Cours trouvé',
                'data' => $cours
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $cours = Cours::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:255|unique:cours,code,' . $cours->id_cours . ',id_cours',
                'description' => 'nullable|string',
                'id_matiere' => 'sometimes|required|exists:matieres,id_matiere',
                'id_filiere' => 'sometimes|required|exists:filieres,id_filiere',
            ]);

            $cours->update($validated);
            $cours->load(['matiere', 'filiere']);

            return response()->json([
                'success' => true,
                'message' => 'Cours modifié avec succès',
                'data' => $cours
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
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
            $cours = Cours::findOrFail($id);
            $cours->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cours supprimé avec succès'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }
    }

    public function stats()
    {
        $total = Cours::count();
        $parMatiere = Cours::selectRaw('id_matiere, COUNT(*) as total')
                          ->groupBy('id_matiere')
                          ->get();

        return response()->json([
            'success' => true,
            'message' => 'Statistiques des cours',
            'data' => [
                'total' => $total,
                'parMatiere' => $parMatiere,
            ],
        ]);
    }
}
