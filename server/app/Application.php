<?php

declare(strict_types=1);

namespace TheMinimalist\Contact;

use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Controllers\ContactController;
use TheMinimalist\Contact\Http\JsonResponse;
use TheMinimalist\Contact\Http\Request;

final class Application
{
    public function __construct(
        private readonly ContactController $contact,
        private readonly AppConfig $config,
    ) {
    }

    public function handle(Request $request): JsonResponse
    {
        $response = match ($request->method) {
            'OPTIONS' => JsonResponse::noContent(),
            'POST' => $this->contact->send($request),
            default => JsonResponse::error(405, 'Only POST requests are accepted.')
                ->withHeader('Allow', 'POST, OPTIONS'),
        };

        return $this->withCors($request, $response);
    }

    private function withCors(Request $request, JsonResponse $response): JsonResponse
    {
        $origin = $request->header('Origin');
        if ($origin === null || !$this->config->allowsOrigin($origin)) {
            return $response;
        }

        return $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type')
            ->withHeader('Access-Control-Max-Age', '600')
            ->withHeader('Vary', 'Origin');
    }
}
