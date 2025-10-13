<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Rappel de Réservation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
        }
        .reservation-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .highlight {
            color: #007bff;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🔔 Rappel de Réservation</h2>
        <p>Bonjour {{ $user->prenom }} {{ $user->nom }},</p>
    </div>

    <div class="content">
        <p>Ceci est un rappel automatique pour votre réservation de salle qui commence dans <span class="highlight">{{ $hours }} heures</span>.</p>

        <div class="reservation-details">
            <h3>📋 Détails de la Réservation</h3>
            <p><strong>Salle :</strong> {{ $salle->nom }} ({{ $salle->type_salle }})</p>
            <p><strong>Localisation :</strong> {{ $salle->localisation }}</p>
            <p><strong>Capacité :</strong> {{ $salle->capacite }} places</p>
            
            @if($cours)
                <p><strong>Cours :</strong> {{ $cours->nom }}</p>
            @endif
            
            <p><strong>Date et heure :</strong> {{ $reservation->date_debut->format('d/m/Y à H:i') }}</p>
            <p><strong>Fin :</strong> {{ $reservation->date_fin->format('d/m/Y à H:i') }}</p>
            
            @if($reservation->type_reservation)
                <p><strong>Type :</strong> {{ $reservation->type_reservation }}</p>
            @endif
            
            @if($reservation->description)
                <p><strong>Description :</strong> {{ $reservation->description }}</p>
            @endif
        </div>

        <p>N'oubliez pas de vous présenter à l'heure prévue. En cas d'annulation, veuillez contacter l'administration.</p>
    </div>

    <div class="footer">
        <p>Ce message a été envoyé automatiquement par le système de gestion des réservations.</p>
        <p>Pour toute question, contactez l'administration.</p>
    </div>
</body>
</html>

