<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    /**
     * Afficher la liste des cours
     */
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
            'message' => 'Listes des cours',
            'data' => $cours
        ]);
    }

    /**
     * Enregistrer un nouveau cours
     */
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
            'message' => 'Cours créé avec succès',
            'data' => $cours
        ], 201);
    }

    /**
     * Mettre à jour un cours
     */
    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:cours,code,' . $cours->id_cours . ',id_cours',
            'description' => 'nullable|string',
            'id_matiere' => 'required|exists:matieres,id_matiere',
            'id_filiere' => 'required|exists:filieres,id_filiere',
        ]);

        $cours->update($validated);
        $cours->load(['matiere', 'filiere']);

        return response()->json([
            'message' => 'Cours modifié avec succès',
            'data' => $cours
        ]);
    }

    /**
     * Afficher un cours
     */
    public function show($id)
    {
        $cours = Cours::with(['matiere', 'filiere'])->findOrFail($id);
        return response()->json([
            'message' => 'Cours trouvé',
            'data' => $cours
        ]);
    }

    /**
     * Supprimer un cours
     */
    public function destroy($id)
    {
        $cours = Cours::findOrFail($id);
        $cours->delete();

        return response()->json([
            'message' => 'Cours supprimé avec succès'
        ]);
    }

    /**
     * Statistiques simples sur les cours
     */
    public function stats()
    {
        $total = Cours::count();
        $parMatiere = Cours::selectRaw('id_matiere, COUNT(*) as total')->groupBy('id_matiere')->get();
        return response()->json([
            'message' => 'Statistiques des cours',
            'data' => [
                'total' => $total,
                'parMatiere' => $parMatiere,
            ],
        ]);
    }
}