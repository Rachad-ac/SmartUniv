<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Liste des rôles
    public function index()
    {
        $roles = Role::all();
        return response()->json([
            'message' => 'Liste des rôles',
            'data' => $roles
        ]);
    }

    // Créer un rôle
    public function store(Request $request)
    {
        $request->validate([
            'role' => 'required|unique:roles',
            'desc' => 'required|string'
        ]);

        $role = Role::create($request->all());
        return response()->json([
            'message' => 'Rôle créé avec succès',
            'data' => $role
        ], 201);
    }

    // Supprimer un rôle
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['message' => 'Rôle supprimé avec succès']);
    }
}
