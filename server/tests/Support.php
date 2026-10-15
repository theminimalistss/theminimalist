<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Tests;

use RuntimeException;
use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Services\Http\HttpClient;
use TheMinimalist\Contact\Services\Http\HttpResponse;
use TheMinimalist\Contact\Services\Mail\EmailMessage;
use TheMinimalist\Contact\Services\Mail\MailDeliveryException;
use TheMinimalist\Contact\Services\Mail\Mailer;
use TheMinimalist\Contact\Services\Security\RateLimiter;

final class Assert
{
    public static function same(mixed $expected, mixed $actual, string $message = ''): void
    {
        if ($expected !== $actual) {
            throw new RuntimeException(trim($message . ' Expected ' . var_export($expected, true)
                . ', got ' . var_export($actual, true) . '.'));
        }
    }

    public static function true(bool $condition, string $message): void
    {
        if (!$condition) {
            throw new RuntimeException($message);
        }
    }

    public static function contains(string $needle, string $haystack, string $message = ''): void
    {
        self::true(str_contains($haystack, $needle), trim("{$message} Missing: {$needle}"));
    }

    public static function throws(string $class, callable $action): void
    {
        try {
            $action();
        } catch (\Throwable $error) {
            self::true($error instanceof $class, "Expected {$class}, got " . $error::class);

            return;
        }
        throw new RuntimeException("Expected {$class} to be thrown.");
    }
}

function config(array $overrides = []): AppConfig
{
    return new AppConfig(...[
        'brevoApiKey' => 'test-key',
        'senderEmail' => 'hello@studio.test',
        'senderName' => 'The Minimalist — Design Studio',
        'studioEmail' => 'studio@studio.test',
        'studioName' => 'The Minimalist',
        'siteUrl' => 'https://studio.test',
        'logoUrl' => 'https://studio.test/email/lotus.png',
        'studioHours' => '7:00 AM – 11:00 AM',
        'allowedOrigins' => ['https://studio.test'],
        'timezone' => 'Asia/Manila',
        'rateLimitAttempts' => 5,
        'rateLimitWindowSeconds' => 900,
        'sendConfirmation' => true,
        ...$overrides,
    ]);
}

final class RecordingHttpClient implements HttpClient
{
    /** @var list<array{url: string, headers: array<string, string>, json: array<string, mixed>}> */
    public array $requests = [];

    public function __construct(private readonly HttpResponse $response = new HttpResponse(201, '{"messageId":"1"}'))
    {
    }

    public function postJson(string $url, array $headers, array $json): HttpResponse
    {
        $this->requests[] = ['url' => $url, 'headers' => $headers, 'json' => $json];

        return $this->response;
    }
}

final class RecordingMailer implements Mailer
{
    /** @var list<EmailMessage> */
    public array $sent = [];

    public function __construct(private readonly bool $fail = false)
    {
    }

    public function send(EmailMessage $message): void
    {
        if ($this->fail) {
            throw new MailDeliveryException('Mail service unavailable.');
        }
        $this->sent[] = $message;
    }
}

final class FixedRateLimiter implements RateLimiter
{
    public function __construct(private readonly bool $allow = true)
    {
    }

    public function attempt(string $key): bool
    {
        return $this->allow;
    }
}
