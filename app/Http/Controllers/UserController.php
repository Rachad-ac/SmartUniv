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
            $users = User::with(['role', 'classes', 'filieres'])->get();
            return response()->json(['success' => true, 'data' => $users], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Recherche filtrée d'utilisateurs.
     * GET /api/users/search?nom=&prenom=&email=&role_id=
     */
    public function search(Request $request)
    {
        $users = User::query()->with(['role', 'classes', 'filieres']);

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
     * Mettre à jour un utilisateur et ses classes/filières.
     * PUT /api/users/{id}
     */
    public function update($id, Request $request)
    {
        try {
            $user = User::findOrFail($id);
    
            // 🔹 Validation des champs
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'prenom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'role_id' => 'sometimes|exists:roles,id',
                'password' => 'sometimes|string|min:8|confirmed',
                'classes' => 'array|nullable',
                'classes.*' => 'exists:classes,id_classe',
                'filieres' => 'array|nullable',
                'filieres.*' => 'exists:filieres,id_filiere',
            ]);
    
            // 🔹 Mise à jour des champs simples
            $user->fill(collect($validated)->only(['nom', 'prenom', 'email', 'role_id'])->toArray());
    
            // 🔹 Mise à jour du mot de passe
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
    
            $user->save();
    
            // 🔹 Synchronisation des relations (Many-to-Many)
            // On n’utilise pas has() mais on vérifie explicitement les valeurs reçues
            $user->classes()->sync($request->input('classes', []));
            $user->filieres()->sync($request->input('filieres', []));
    
            // 🔹 Rechargement des relations pour la réponse
            $user->load(['role', 'classes', 'filieres']);
    
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès.',
                'data' => $user
            ], 200);
    
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Supprimer un utilisateur (et ses relations pivot).
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // 🔹 Supprimer les relations pivot avant suppression
            $user->classes()->detach();
            $user->filieres()->detach();

            $user->delete();

            return response()->json(['success' => true, 'message' => 'Utilisateur supprimé.']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
