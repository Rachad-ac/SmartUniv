<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Vérifier si l'utilisateur est authentifié
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Vérifier si l'utilisateur a l'un des rôles requis
        $userRole = $request->user()->role->nom;

        foreach ($roles as $role) {
            if ($userRole === $role) {
                return $next($request);
            }
        }

        // Si aucun rôle ne correspond
        return response()->json([
            'message' => 'Accès refusé. Rôles requis : ' . implode(', ', $roles)
        ], 403);
    }
}