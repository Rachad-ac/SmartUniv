<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException; 
use Exception; 
use Illuminate\Support\Facades\Hash; 
use Illuminate\Validation\ValidationException; // Ajout de l'import pour la validation

class UserController extends Controller
{
    /**
     * Récupère et retourne la liste de tous les utilisateurs.
     * Accessible via : GET /api/users/all
     */
    public function index()
    {
        try {
            $users = User::all();

            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur : ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Recherche des utilisateurs en fonction d'un terme de recherche (filtre) sur plusieurs colonnes.
     * Accessible via : GET /api/users/search?query=valeur_a_chercher
     */
   public function search(Request $request)
    {
        $users = User::query(); 

        if ($request->filled('nom')) {
            $users->where('nom', 'LIKE', '%' . $request->input('nom') . '%');
        }

        if ($request->filled('prenom')) {
            $users->where('prenom', 'LIKE', '%' . $request->input('prenom') . '%');
        }

        if ($request->filled('email')) {
            $users->where('email', 'LIKE', '%' . $request->input('nom') . '%');
        }

        if ($request->filled('role')) {
            $users->where('role', $request->input('role'));
        }

        return response()->json([
            'success' => true,
            'data' => $users->get()
        ], 200);
    }


    /**
     * Met à jour les informations d'un utilisateur spécifique.
     * Accessible via : PUT /api/users/{id}
     */
    public function update($id, Request $request)
    {
        try {
            // 1. Trouver l'utilisateur
            $user = User::findOrFail($id);

            // 2. Valider les données reçues
            $request->validate([
                'nom' => 'sometimes|string|max:255',
                'prenom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id, 
                'role' => 'sometimes|in:Admin,Etudiant,Enseignant', 
                'password' => 'sometimes|nullable|string|min:8|confirmed',
            ]);

            // 3. Remplir le modèle avec les données du formulaire
            $user->fill($request->except('password', 'password_confirmation'));

            // 4. Gérer la mise à jour du mot de passe
            if ($request->filled('password')) {
                $user->password = Hash::make($request->input('password'));
            }

            // 5. Sauvegarder les modifications
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès.',
                'data' => $user
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé.'
            ], 404);
        } catch (ValidationException $e) {
            // Gérer spécifiquement les erreurs de validation (422)
            return response()->json([
                'success' => false,
                'message' => 'Les données fournies sont invalides.',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur lors de la mise à jour.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprime un utilisateur spécifique.
     * Accessible via : DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User supprimé avec succès.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User non trouvé.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}