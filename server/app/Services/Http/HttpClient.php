<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Http;

interface HttpClient
{
    /**
     * @param array<string, string> $headers
     * @param array<string, mixed> $json
     */
    public function postJson(string $url, array $headers, array $json): HttpResponse;
}
