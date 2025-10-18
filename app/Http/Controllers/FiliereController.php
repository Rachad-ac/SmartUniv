<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class FiliereController extends Controller
{
    /**
     * Lister toutes les filières
     */
    public function index()
    {
        try {
            $filieres = Filiere::with('etudiants' , 'classes')->get();
            return response()->json([
                'success' => true,
                'message' => 'Liste des filières',
                'data'    => $filieres
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Créer une nouvelle filière
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom'         => 'required|string|max:100',
                'code'        => 'required|string|max:20|unique:filieres,code',
                'description' => 'nullable|string'
            ]);

            $filiere = Filiere::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Filière créée avec succès',
                'data'    => $filiere
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Afficher une filière par ID
     */
    public function show($id)
    {
        try {
            $filiere = Filiere::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Filière trouvée',
                'data'    => $filiere
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Mettre à jour une filière
     */
    public function update(Request $request, $id)
    {
        try {
            $filiere = Filiere::findOrFail($id);

            $validated = $request->validate([
                'nom'         => 'sometimes|string|max:100',
                'code'        => 'sometimes|string|max:20|unique:filieres,code,' . $id,
                'description' => 'nullable|string'
            ]);

            $filiere->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Filière mise à jour avec succès',
                'data'    => $filiere
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Supprimer une filière
     */
    public function destroy($id)
    {
        try {
            $filiere = Filiere::findOrFail($id);
            $filiere->delete();

            return response()->json([
                'success' => true,
                'message' => 'Filière supprimée avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }
}
