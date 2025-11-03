<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Statut demande réservation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
        }
        .card {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #ddd;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .card-header {
            background-color: #0d6efd;
            color: #ffffff;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
        .card-body {
            padding: 20px;
            color: #333333;
            font-size: 15px;
            line-height: 1.6;
        }
        .status-valid {
            color: green;
            font-weight: bold;
        }
        .status-refused {
            color: red;
            font-weight: bold;
        }
        .card-footer {
            padding: 12px;
            font-size: 12px;
            text-align: center;
            color: #777777;
            background: #f8f9fa;
        }
    </style>
    <link rel="stylesheet" href="validation.css">
</head>
<body>

    <div class="card">
        <div class="card-header">
            📌 Statut de votre demande de réservation
        </div>
        <div class="card-body">
            <p>Bonjour {{ $reservation->user->prenom }} {{ $reservation->user->nom }},</p>

            @if($decision === 'validée')
                <p>
                    Votre réservation de la salle 
                    <strong>{{ $reservation->salle->nom }}</strong> 
                    pour periode du <strong>{{ $reservation->date_debut}} au {{ $reservation->date_fin }}</strong> 
                    a été <span class="status-valid">validée ✅</span>.
                </p>
            @else
                <p>
                    Votre réservation de la salle 
                    <strong>{{ $reservation->salle->nom }}</strong> 
                    pour la periode du <strong>{{ $reservation->date_debut }} au {{ $reservation->date_fin }}</strong> 
                    a été <span class="status-refused">refusée ❌</span>.
                </p>
            @endif

            <p>Merci d’utiliser notre système.</p>
        </div>
        <div class="card-footer">
            📧 Notification automatique – Merci de ne pas répondre à cet email
        </div>
    </div>

</body>
</html>
