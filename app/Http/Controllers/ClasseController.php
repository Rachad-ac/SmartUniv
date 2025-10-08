<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    // Liste toutes les classes
    public function index()
    {
        $classe = Classe::all();
        
        return response()->json([
            'message' => 'Liste des classes',
            'data'    => $classe
        ]);
    }

    // Créer une classe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'id_filiere' => 'required|exists:filieres,id',
            'niveau' => 'required|string|max:50',
        ]);

        $classe = Classe::create($validated);
        
        return response()->json([
            'message' => 'Classe creer avec succes',
            'data'    => $classe
        ]);
    }

    // Afficher une classe
    public function show(Classe $classe)
    {
        return $classe->load('filiere');
    }

    // Modifier une classe
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'id_filiere' => 'sometimes|exists:filieres,id',
            'niveau' => 'sometimes|string|max:50',
        ]);

        $classe = Classe::firstOrFail($id);
        $classe->update($validated);

        return response()->json([
            'message' => 'Classe mise a jour avec succes',
            'data'    => $classe
        ]);
    }

    // Supprimer une classe
    public function destroy($id)
    {
        $classe = Classe::firstOrFail($id);

        $classe->delete();

        return response()->json([
            'message' => 'Classe supprimer avec succes',
        ]);
    }
}
