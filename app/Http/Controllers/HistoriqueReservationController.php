<?php

namespace App\Http\Controllers;

use App\Models\HistoriqueReservation;
use Illuminate\Http\Request;

class HistoriqueReservationController extends Controller
{
    /**
     * Lister tous les historiques. 
     */
    public function index()
    {
        try {
            $historiques = HistoriqueReservation::with(['reservation', 'utilisateur'])
                ->orderBy('date_action', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $historiques,
                'count' => $historiques->count()
            ]);
        } catch (\Exception $e) {
            // L'erreur sera affichée dans le frontend (Network tab > Response)
            return response()->json([
                'success' => false,
                'message' => 'Erreur de BDD/Relation : ' . $e->getMessage() . ' à la ligne ' . $e->getLine(),
                'trace' => $e->getTraceAsString() // Pour le débogage approfondi
            ], 500);
        }
    }

    /**
     * Afficher un historique spécifique.
     */
    public function show($id)
    {
        $historique = HistoriqueReservation::with(['reservation', 'utilisateur'])->find($id);

        if (!$historique) {
            return response()->json([
                'success' => false,
                'message' => 'Historique non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $historique
        ]);
    }

    /**
     * Créer un nouvel historique.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id_reservation',
            'utilisateur_id' => 'required|exists:users,id',
            'action' => 'required|string|max:100',
            'details' => 'nullable|string',
            'date_action' => now()
        ]);

        $validated['date_action'] = $validated['date_action'] ?? now();

        $historique = HistoriqueReservation::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Historique créé avec succès',
            'data' => $historique
        ], 201);
    }

    /**
     * Mettre à jour un historique existant.
     */
    public function update(Request $request, $id)
    {
        $historique = HistoriqueReservation::find($id);

        if (!$historique) {
            return response()->json([
                'success' => false,
                'message' => 'Historique non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'action' => 'sometimes|required|string|max:100',
            'details' => 'nullable|string',
            'date_action' => 'nullable|date'
        ]);

        $historique->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Historique mis à jour',
            'data' => $historique
        ]);
    }

    /**
     * Supprimer un historique.
     */
    public function destroy($id)
    {
        $historique = HistoriqueReservation::find($id);

        if (!$historique) {
            return response()->json([
                'success' => false,
                'message' => 'Historique non trouvé'
            ], 404);
        }

        $historique->delete();

        return response()->json([
            'success' => true,
            'message' => 'Historique supprimé avec succès'
        ]);
    }

    /**
     * Optionnel : récupérer tous les historiques pour une réservation spécifique
     */
    public function getByReservation($reservationId)
    {
        $historiques = HistoriqueReservation::with('utilisateur')
            ->where('reservation_id', $reservationId)
            ->orderBy('date_action', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $historiques,
            'count' => $historiques->count()
        ]);
    }
}
