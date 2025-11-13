<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class NotificationController extends Controller
{
    /**
     * Récupérer toutes les notifications d’un utilisateur
     */
    public function index($userId)
    {
        try {
            $notifications = Notification::with(['user' , 'reservation'])
                                         ->where('id_user', $userId)
                                         ->where('lu', false)
                                         ->orderBy('date_envoi', 'desc')
                                         ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'count' => $notifications->count()
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        try {
            $notif = Notification::findOrFail($id);
            $notif->update(['lu' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marquée comme lue',
                'data' => $notif
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        try {
            $notif = Notification::findOrFail($id);
            $notif->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification supprimée'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }
}
