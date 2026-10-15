<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Http;

final class Request
{
    /**
     * @param array<string, string> $headers
     */
    public function __construct(
        public readonly string $method,
        public readonly array $headers,
        public readonly string $body,
        public readonly string $clientIp,
    ) {
    }

    public static function fromGlobals(): self
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $headers[self::normalize(substr($key, 5))] = (string) $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = (string) $_SERVER['CONTENT_TYPE'];
        }

        return new self(
            strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')),
            $headers,
            (string) file_get_contents('php://input', length: 65_536),
            (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
        );
    }

    public function header(string $name): ?string
    {
        return $this->headers[self::normalize($name)] ?? null;
    }

    public function isJson(): bool
    {
        return str_contains(strtolower($this->header('Content-Type') ?? ''), 'application/json');
    }

    /**
     * @return array<string, mixed>|null
     */
    public function json(): ?array
    {
        $data = json_decode($this->body, true);

        return is_array($data) ? $data : null;
    }

    private static function normalize(string $name): string
    {
        return strtolower(str_replace('_', '-', $name));
    }
}
