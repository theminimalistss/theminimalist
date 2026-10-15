<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Http;

final class JsonResponse
{
    /**
     * @param array<string, mixed>|null $payload
     * @param array<string, string> $headers
     */
    private function __construct(
        public readonly int $status,
        public readonly ?array $payload,
        public readonly array $headers = [],
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     */
    public static function ok(array $payload, int $status = 200): self
    {
        return new self($status, $payload);
    }

    /**
     * @param array<string, string> $fields
     */
    public static function error(int $status, string $message, array $fields = []): self
    {
        $payload = ['ok' => false, 'message' => $message];
        if ($fields !== []) {
            $payload['errors'] = $fields;
        }

        return new self($status, $payload);
    }

    public static function noContent(): self
    {
        return new self(204, null);
    }

    public function withHeader(string $name, string $value): self
    {
        return new self($this->status, $this->payload, [...$this->headers, $name => $value]);
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        if ($this->payload !== null) {
            echo json_encode($this->payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        }
    }
}
