<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Http;

use RuntimeException;

final class CurlHttpClient implements HttpClient
{
    public function __construct(private readonly int $timeoutSeconds = 10)
    {
    }

    public function postJson(string $url, array $headers, array $json): HttpResponse
    {
        $lines = ['Content-Type: application/json', 'Accept: application/json'];
        foreach ($headers as $name => $value) {
            $lines[] = "{$name}: {$value}";
        }

        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $lines,
            CURLOPT_POSTFIELDS => json_encode($json, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeoutSeconds,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $error = curl_error($handle);

        if ($body === false) {
            throw new RuntimeException("The mail service could not be reached: {$error}");
        }

        return new HttpResponse($status, (string) $body);
    }
}
