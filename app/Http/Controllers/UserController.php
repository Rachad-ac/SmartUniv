<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;

class UserController extends Controller
{
    /**
     * Liste de tous les utilisateurs.
     * GET /api/users/all
     */
    public function index()
    {
        try {
            $users = User::with('role')->get();
            return response()->json(['success' => true, 'data' => $users], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur serveur.', 'details' => config('app.debug') ? $e->getMessage() : null], 500);
        }
    }

    /**
     * Recherche filtrée d'utilisateurs.
     * GET /api/users/search?nom=&prenom=&email=&role_id=
     */
    public function search(Request $request)
    {
        $users = User::query();

        if ($request->filled('nom')) {
            $users->where('nom', 'LIKE', '%' . $request->nom . '%');
        }
        if ($request->filled('prenom')) {
            $users->where('prenom', 'LIKE', '%' . $request->prenom . '%');
        }
        if ($request->filled('email')) {
            $users->where('email', 'LIKE', '%' . $request->email . '%');
        }
        if ($request->filled('role_id')) {
            $users->where('role_id', $request->role_id);
        }

        return response()->json(['success' => true, 'data' => $users->get()], 200);
    }

    /**
     * Mettre à jour un utilisateur.
     * PUT /api/users/{id}
     */
    public function update($id, Request $request)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'nom' => 'sometimes|string|max:255',
                'prenom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'role_id' => 'sometimes|exists:roles,id',
                'password' => 'sometimes|string|min:8|confirmed',
            ]);

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->fill($request->only(['nom', 'prenom', 'email', 'role_id']));
            $user->save();

            return response()->json(['success' => true, 'message' => 'Utilisateur mis à jour.', 'data' => $user]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur serveur.', 'details' => config('app.debug') ? $e->getMessage() : null], 500);
        }
    }

    /**
     * Supprimer un utilisateur.
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['success' => true, 'message' => 'Utilisateur supprimé.']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur serveur.', 'details' => config('app.debug') ? $e->getMessage() : null], 500);
        }
    }
}
