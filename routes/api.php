<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\HistoriqueReservationController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\TestController;


// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Profil utilisateur connecté
    Route::get('/user/{id}', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route réservée uniquement aux admins
    Route::middleware('role:Admin')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'stats']);
        Route::get('/latest-users', [DashboardController::class, 'latestUsers']);
        Route::post('/register', [AuthController::class, 'register']);

        Route::prefix('roles')->group(function () {
            Route::get('/all', [RoleController::class, 'index']);    
            Route::post('/create', [RoleController::class, 'store']); 
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        Route::prefix('/users')->group(function () {
            Route::get('/all', [UserController::class, 'index']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::get('/search', [UserController::class, 'search']);
        });

        Route::prefix('historique-reservations')->group(function () {
            Route::get('/all', [HistoriqueReservationController::class, 'index']);    
            Route::put('/{id}', [HistoriqueReservationController::class, 'update']);
            Route::delete('/{id}', [HistoriqueReservationController::class, 'destroy']);
        });

        Route::prefix('reservations')->group(function () {
            Route::get('/all', [ReservationController::class, 'index']);
            Route::get('/en-attente', [ReservationController::class, 'reservationEnAttente']);
            Route::get('/{id}', [ReservationController::class, 'show']);
            Route::put('/valider/{id}', [ReservationController::class, 'valider']);
            Route::put('/rejeter/{id}', [ReservationController::class, 'rejeter']);
        });

        Route::prefix('salles')->group(function () {
            Route::post('/create', [SalleController::class, 'store']);
            Route::put('/{id}', [SalleController::class, 'update']);
            Route::delete('/{id}' , [SalleController::class , 'destroy']);
        });

        Route::prefix('cours')->group(function () {
            Route::get('/all', [CoursController::class, 'index']);
            Route::get('/{id}', [CoursController::class, 'show']);
            Route::get('/stats', [CoursController::class, 'stats']);
            Route::post('/create', [CoursController::class, 'store']);
            Route::put('/{id}', [CoursController::class, 'update']);
            Route::delete('/{id}' , [CoursController::class , 'destroy']);
        });

        // Routes Equipement
        Route::prefix('equipements')->group(function () {
            Route::get('/all', [EquipementController::class, 'index']);
            Route::post('/create', [EquipementController::class, 'store']);
            Route::get('/{id}', [EquipementController::class, 'show']);
            Route::put('/{id}', [EquipementController::class, 'update']);
            Route::delete('/{id}', [EquipementController::class, 'destroy']);
            Route::get('/search/{id}', [EquipementController::class, 'search']);
        });

        Route::prefix('filieres')->group(function () {
            Route::get('/all', [FiliereController::class, 'index']);
            Route::post('/create', [FiliereController::class, 'store']);
            Route::get('/{id}', [FiliereController::class, 'show']);
            Route::put('/{id}', [FiliereController::class, 'update']);
            Route::delete('/{id}', [FiliereController::class, 'destroy']);
        });

        Route::prefix('matieres')->group(function () {
            Route::get('/all', [MatiereController::class , 'index']);
            Route::post('/create', [MatiereController::class , 'store']);
            Route::delete('/{id}', [MatiereController::class , 'destroy']);
            Route::put('/{id}', [MatiereController::class , 'update']);
        });

        Route::prefix('classes')->group(function () {
            Route::get('/all', [ClasseController::class , 'index']);
            Route::post('/create', [ClasseController::class , 'store']);
            Route::get('/{id}', [ClasseController::class , 'show']);
            Route::delete('/{id}', [ClasseController::class , 'destroy']);
            Route::put('/{id}', [ClasseController::class , 'update']);
        });

        Route::prefix('plannings')->group(function () {
            Route::post('/create', [PlanningController::class , 'store']);
            Route::delete('/{id}', [PlanningController::class , 'destroy']);
            Route::put('/{id}', [PlanningController::class , 'update']);
        });

        // Routes pour les rappels automatiques
        Route::prefix('reminders')->group(function () {
            Route::post('/send-upcoming', [ReminderController::class, 'sendUpcomingReminders']);
            Route::post('/cancel-expired', [ReminderController::class, 'cancelExpiredReservations']);
            Route::post('/send-pending', [ReminderController::class, 'sendPendingReminders']);
            Route::post('/run-all', [ReminderController::class, 'runAllReminders']);
        });

        // Routes de test (développement uniquement)
        Route::prefix('test')->group(function () {
            Route::post('/conflict-detection', [TestController::class, 'testConflictDetection']);
            Route::post('/reminder-system', [TestController::class, 'testReminderSystem']);
            Route::get('/conflict-stats', [TestController::class, 'getConflictStats']);
        });

    });

    // Routes Enseigant et Etudiant uniquement
    Route::middleware(['role:Enseignant,Etudiant'])->group(function () {

        Route::prefix('reservations')->group(function () {
            Route::post('/reserver', [ReservationController::class, 'store']);
            Route::put('/{id}', [ReservationController::class, 'update']);
            Route::post('/annuler/{id}', [ReservationController::class, 'annulerReservation']);
            Route::delete('/{id}', [ReservationController::class, 'destroy']);
            Route::get('/mes-reservations/{id}', [ReservationController::class, 'mesReservations']);
            Route::post('/check-availability', [ReservationController::class, 'checkAvailability']);
        });

        
    });

    Route::prefix('classes')->group(function () {
        Route::get('/all', [ClasseController::class , 'index']);
    });

    Route::prefix('filieres')->group(function () {
        Route::get('/all', [FiliereController::class, 'index']);
    });


    Route::prefix('cours')->group(function () {
        Route::get('/all', [CoursController::class, 'index']);
    });

    Route::prefix('plannings')->group(function () {
        Route::get('/all', [PlanningController::class , 'index']);
        Route::get('/by-user/{id_user}', [PlanningController::class, 'getByUser']);
        Route::get('/by-filiere-classe/{id_filiere}/{id_classe}', [PlanningController::class, 'getPlanningFiliereClasse']);
    });

    Route::get('equipements/{id}', [EquipementController::class, 'show']); 


    Route::prefix('reservations')->group(function () {
        Route::post('/reserver', [ReservationController::class, 'store']);
        Route::put('/{id}', [ReservationController::class, 'update']);
        Route::post('/annuler/{id}', [ReservationController::class, 'annulerReservation']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);
        Route::get('/mes-reservations/{id}', [ReservationController::class, 'mesReservations']);
    });

    Route::prefix('salles')->group(function () {
        Route::get('/all', [SalleController::class, 'index']);
        Route::get('/{id}', [SalleController::class, 'show']);
    });
   

    Route::prefix('/notifications')->group(function () {
        Route::get('/{userId}', [NotificationController::class, 'index']); 
        Route::put('/read/{id}', [NotificationController::class, 'markAsRead']); 
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });

});
