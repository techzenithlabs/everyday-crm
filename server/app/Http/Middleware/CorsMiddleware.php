<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    protected $allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://client-frontend.com',  // example production domain
        'https://app.everydaycrm.com',  // your actual production frontend
    ];
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        $response = $request->getMethod() === "OPTIONS"
            ? response('', 204)
            : $next($request);

        if (in_array($origin, $this->allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
