<?php

namespace App\Services;

use App\Models\Planning;
use App\Models\Reservation;
use Carbon\Carbon;

class ConflictDetectionService
{
    /**
     * Vérifie s'il y a un conflit entre une nouvelle réservation et le planning existant
     */
    public function checkPlanningConflict($salleId, $dateDebut, $dateFin, $excludeReservationId = null)
    {
        $query = Planning::where('id_salle', $salleId)
            ->where(function($q) use ($dateDebut, $dateFin) {
                $q->whereBetween('date_debut', [$dateDebut, $dateFin])
                  ->orWhereBetween('date_fin', [$dateDebut, $dateFin])
                  ->orWhere(function($q2) use ($dateDebut, $dateFin) {
                      $q2->where('date_debut', '<', $dateDebut)
                         ->where('date_fin', '>', $dateFin);
                  });
            });

        // Exclure la réservation actuelle si on fait une mise à jour
        if ($excludeReservationId) {
            $query->where('id_reservation', '!=', $excludeReservationId);
        }

        return $query->first();
    }

    /**
     * Vérifie s'il y a un conflit avec d'autres réservations validées
     */
    public function checkReservationConflict($salleId, $dateDebut, $dateFin, $excludeReservationId = null)
    {
        $query = Reservation::where('id_salle', $salleId)
            ->where('statut', 'Validée')
            ->where(function($q) use ($dateDebut, $dateFin) {
                $q->whereBetween('date_debut', [$dateDebut, $dateFin])
                  ->orWhereBetween('date_fin', [$dateDebut, $dateFin])
                  ->orWhere(function($q2) use ($dateDebut, $dateFin) {
                      $q2->where('date_debut', '<', $dateDebut)
                         ->where('date_fin', '>', $dateFin);
                  });
            });

        // Exclure la réservation actuelle si on fait une mise à jour
        if ($excludeReservationId) {
            $query->where('id_reservation', '!=', $excludeReservationId);
        }

        return $query->first();
    }

    /**
     * Vérifie tous les conflits possibles (planning + réservations)
     */
    public function checkAllConflicts($salleId, $dateDebut, $dateFin, $excludeReservationId = null)
    {
        $planningConflict = $this->checkPlanningConflict($salleId, $dateDebut, $dateFin, $excludeReservationId);
        $reservationConflict = $this->checkReservationConflict($salleId, $dateDebut, $dateFin, $excludeReservationId);

        return [
            'has_conflict' => $planningConflict || $reservationConflict,
            'planning_conflict' => $planningConflict,
            'reservation_conflict' => $reservationConflict,
            'conflict_type' => $planningConflict ? 'planning' : ($reservationConflict ? 'reservation' : null),
            'conflict_details' => $this->getConflictDetails($planningConflict, $reservationConflict)
        ];
    }

    /**
     * Génère les détails du conflit pour l'utilisateur
     */
    private function getConflictDetails($planningConflict, $reservationConflict)
    {
        if ($planningConflict) {
            return [
                'type' => 'planning',
                'message' => 'Cette salle est déjà occupée dans le planning officiel',
                'conflict_start' => $planningConflict->date_debut,
                'conflict_end' => $planningConflict->date_fin,
                'conflict_cours' => $planningConflict->cours->nom ?? 'N/A',
                'conflict_enseignant' => $planningConflict->user->nom . ' ' . $planningConflict->user->prenom
            ];
        }

        if ($reservationConflict) {
            return [
                'type' => 'reservation',
                'message' => 'Cette salle est déjà réservée par un autre utilisateur',
                'conflict_start' => $reservationConflict->date_debut,
                'conflict_end' => $reservationConflict->date_fin,
                'conflict_user' => $reservationConflict->user->nom . ' ' . $reservationConflict->user->prenom
            ];
        }

        return null;
    }

    /**
     * Vérifie la disponibilité d'une salle pour un créneau donné
     */
    public function isSalleAvailable($salleId, $dateDebut, $dateFin, $excludeReservationId = null)
    {
        $conflicts = $this->checkAllConflicts($salleId, $dateDebut, $dateFin, $excludeReservationId);
        return !$conflicts['has_conflict'];
    }
}

