<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class RoleController extends Controller
{
    /**
     * Liste des rôles
     * GET /api/roles
     */
    public function index()
    {
        $roles = Role::all();
        return response()->json([
            'success' => true,
            'message' => 'Liste des rôles',
            'data' => $roles
        ], 200);
    }

    /**
     * Créer un rôle
     * POST /api/roles/create
     */
    public function store(Request $request)
    {
        try {
        $request->validate([
            'nom' => 'required|string|unique:roles,nom',
            'description' => 'required|string',
        ]);

        $role = Role::create([
            'nom' => $request->nom,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rôle créé avec succès',
            'data' => $role
        ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour un rôle
     * PUT /api/roles/{id}
     */
    public function update($id, Request $request)
    {
        try {
            $role = Role::findOrFail($id);
            $role->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Rôle mis à jour avec succès',
                'data' => $role
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle non trouvé'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    

    /**
     * Supprimer un rôle
     * DELETE /api/roles/{id}
     */
    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->delete();

            return response()->json([
                'success' => true,
                'message' => 'Rôle supprimé avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle non trouvé'
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
