<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Salle;
use App\Models\Notification;
use App\Models\HistoriqueReservation;
use App\Services\ConflictDetectionService;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
use App\Mail\ReservationMail;
use App\Mail\ValidationMail;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    protected $conflictService;

    public function __construct(ConflictDetectionService $conflictService)
    {
        $this->conflictService = $conflictService;
    }
    // Liste de toutes les réservations
    public function index()
    {
        $reservations = Reservation::with(['salle', 'user', 'cours'])->get();
        return response()->json([
            'success' => true,
            'message' => 'Liste des réservations',
            'data' => $reservations
        ], 200);
    }

    // liste de toutes les réservations en attente
    public function reservationEnAttente()
    {
        $reservations = Reservation::where('statut' , 'En attente')->with(['salle', 'user', 'cours'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des réservations',
            'data' => $reservations
        ], 200);
    }

    // Les réservations d'un utilisateur
    public function mesReservations($id)
    {
        $reservations = Reservation::where('id_user', $id)
            ->with(['salle', 'cours'])
            ->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Vos réservations',
            'data' => $reservations
        ], 200);
    }

    // Valider une réservation
    public function valider($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->statut = 'Validée';
            $reservation->save();

            Mail::to($reservation->user->email)
                ->send(new ValidationMail($reservation, 'validée'));

            Notification::create([
                'message' => "Votre réservation de la salle {$reservation->salle->nom} a été validée.",
                'date_envoi' => now(),
                'lu' => false,
                'id_user' => $reservation->id_user,
                'id_reservation' => $reservation->id_reservation,
            ]);

            // Après la validation de la réservation
            HistoriqueReservation::create([
                'reservation_id' => $reservation->id_reservation,
                'utilisateur_id' => auth()->id(), 
                'action' => 'valider réservation',
                'details' => 'Réservation marquée comme validée par ' . " " . auth()->user()->nom . " " . auth()->user()->prenom,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réservation validée et notification envoyée',
                'data' => $reservation
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Réservation non trouvée'], 404);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur serveur'], 500);
        }
    }

    // Rejeter une réservation
    public function rejeter($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->statut = 'Refusée';
            $reservation->save();

            Mail::to($reservation->user->email)
                ->send(new ValidationMail($reservation, 'refusée'));

            Notification::create([
                'message' => "Votre réservation de la salle {$reservation->salle->nom} a été refusée.",
                'date_envoi' => now(),
                'lu' => false,
                'id_user' => $reservation->id_user,
                'id_reservation' => $reservation->id_reservation,
            ]);

            // Après le rejet de la réservation
            HistoriqueReservation::create([
                'reservation_id' => $reservationId,
                'utilisateur_id' => auth()->id(), 
                'action' => 'rejeter réservation',
                'details' => 'Réservation rejetée par '. " " . auth()->user()->nom . " " . auth()->user()->prenom,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réservation refusée et notification envoyée',
                'data' => $reservation
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Réservation non trouvée'], 404);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur serveur'], 500);
        }
    }


    // Créer une réservation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_salle' => 'required|exists:salles,id_salle',
            'id_cours' => 'nullable|exists:cours,id_cours',
            'id_filiere' => 'nullable|exists:filieres,id_filiere',
            'id_classe' => 'nullable|exists:classes,id_classe',
            'date_debut' => 'required|date|before:date_fin',
            'date_fin' => 'required|date|after:date_debut',
            'type_reservation' => 'required|in:Cours,Examen,Evenement,TP',
            'statut' => 'nullable|in:En attente,Validée,Refusée,Annulée',
            'motif' => 'nullable|string|max:255',
        ]);

        // 🔍 Vérification des conflits AVANT de créer la réservation
        $conflicts = $this->conflictService->checkAllConflicts(
            $validated['id_salle'],
            $validated['date_debut'],
            $validated['date_fin']
        );

        if ($conflicts['has_conflict']) {
            return response()->json([
                'success' => false,
                'message' => 'Conflit de réservation détecté',
                'conflict_details' => $conflicts['conflict_details'],
                'error_code' => 'CONFLICT_DETECTED'
            ], 409);
        }

        $validated['statut'] = $validated['statut'] ?? 'En attente';
        $reservation = Reservation::create($validated);

        Mail::to('bent35005@gmail.com')->send(new ReservationMail($reservation));

        Notification::create([
            'message' => "Nouvelle demande de réservation pour la salle {$reservation->salle->nom}",
            'date_envoi' => now(),
            'lu' => false,
            'id_user' => 1,
            'id_reservation' => $reservation->id_reservation,
        ]);

        // Après qu'une nouvelle réservation a été créée
        HistoriqueReservation::create([
            'reservation_id' => $reservation->id_reservation,
            'utilisateur_id' => auth()->id(), 
            'action' => 'demander réservation',
            'details' => 'Nouvelle réservation demandée par l\'utilisateur.' . " " . auth()->user()->nom . " " . auth()->user()->prenom,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation créée et demande envoyée',
            'data' => $reservation
        ], 201);
    }

    // Annuler une réservation
    public function annulerReservation($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->statut = 'Annulée';
            $reservation->save();

            // Création de notification
            Notification::create([
                'message' => "Vous avez annulé votre réservation de la salle {$reservation->salle->nom}.",
                'date_envoi' => now(),
                'lu' => false,
                'id_user' => $reservation->id_user,
                'id_reservation' => $reservation->id_reservation,
            ]);

            Notification::create([
                'message' => "L'utilisateur {$reservation->user->nom} {$reservation->user->prenom} a annulé sa réservation de la salle {$reservation->salle->nom}.",
                'date_envoi' => now(),
                'lu' => false,
                'id_user' => 1, // id de l'admin
                'id_reservation' => $reservation->id_reservation,
            ]);

            // Après l'annulation de la réservation
            HistoriqueReservation::create([
                'reservation_id' => $reservation->id_reservation,
                'utilisateur_id' => auth()->id(), 
                'action' => 'annuler réservation',
                'details' => 'Réservation annulée par ' . " " . auth()->user()->nom . " " . auth()->user()->prenom,
            ]);
            

            return response()->json([
                'success' => true,
                'message' => 'Réservation annulée et notification envoyée',
                'data' => $reservation
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }


    // Mettre à jour une réservation
    public function update(Request $request, $id)
    {
        try {
            $reservation = Reservation::findOrFail($id);

            $validated = $request->validate([
                'id_user' => 'sometimes|exists:users,id',
                'id_salle' => 'sometimes|exists:salles,id_salle',
                'id_cours' => 'nullable|exists:cours,id_cours',
                'id_filiere' => 'nullable|exists:filieres,id_filiere',
                'id_classe' => 'nullable|exists:classes,id_classe',
                'date_debut' => 'sometimes|date|before:date_fin',
                'date_fin' => 'sometimes|date|after:date_debut',
                'statut' => 'nullable|in:En attente,Validée,Refusée,Annulée',
                'type_reservation' => 'sometimes|in:Cours,Examen,Evenement,TP',
                'motif' => 'nullable|string|max:255',
            ]);

            // 🔍 Vérification des conflits pour la mise à jour
            if (isset($validated['id_salle']) || isset($validated['date_debut']) || isset($validated['date_fin'])) {
                $salleId = $validated['id_salle'] ?? $reservation->id_salle;
                $dateDebut = $validated['date_debut'] ?? $reservation->date_debut;
                $dateFin = $validated['date_fin'] ?? $reservation->date_fin;

                $conflicts = $this->conflictService->checkAllConflicts(
                    $salleId,
                    $dateDebut,
                    $dateFin,
                    $reservation->id_reservation
                );

                if ($conflicts['has_conflict']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Conflit de réservation détecté lors de la mise à jour',
                        'conflict_details' => $conflicts['conflict_details'],
                        'error_code' => 'CONFLICT_DETECTED'
                    ], 409);
                }
            }

            $reservation->update($validated);

            Notification::create([
                'message' => "Votre réservation pour la salle {$reservation->salle->nom} a été mise à jour.",
                'date_envoi' => now(),
                'lu' => false,
                'id_user' => $reservation->id_user,
                'id_reservation' => $reservation->id_reservation,
            ]);

            // Après la modification (update) de la réservation
            HistoriqueReservation::create([
                'reservation_id' => $reservation->id_reservation,
                'utilisateur_id' => auth()->id(), 
                'action' => 'modifier réservation',
                'details' => 'Détails de la réservation mis à jour par ' . " " . auth()->user()->nom . " " . auth()->user()->prenom,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réservation mise à jour',
                'data' => $reservation
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Réservation non trouvée'], 404);
        }
    }

    // Recherche filtrée
    public function search(Request $request)
    {
        $query = Reservation::query();

        if ($request->filled('id_salle')) {
            $query->where('id_salle', $request->id_salle);
        }

        if ($request->filled('date')) {
            $query->whereDate('date_debut', '<=', $request->date)
                  ->whereDate('date_fin', '>=', $request->date);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json([
            'success' => true,
            'message' => 'Résultats de recherche',
            'data' => $query->get()
        ], 200);
    }

    // Supprimer une réservation
    public function destroy($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Réservation supprimée avec succès'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Réservation non trouvée'], 404);
        }
    }

    // 🔍 Vérifier la disponibilité d'une salle
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'id_salle' => 'required|exists:salles,id_salle',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $conflicts = $this->conflictService->checkAllConflicts(
            $validated['id_salle'],
            $validated['date_debut'],
            $validated['date_fin']
        );

        return response()->json([
            'success' => true,
            'available' => !$conflicts['has_conflict'],
            'conflict_details' => $conflicts['conflict_details'],
            'salle_id' => $validated['id_salle'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin']
        ], 200);
    }
}
