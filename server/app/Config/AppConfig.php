<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Config;

use RuntimeException;

final class AppConfig
{
    /**
     * @param list<string> $allowedOrigins
     */
    public function __construct(
        public readonly string $brevoApiKey,
        public readonly string $senderEmail,
        public readonly string $senderName,
        public readonly string $studioEmail,
        public readonly string $studioName,
        public readonly string $siteUrl,
        public readonly string $logoUrl,
        public readonly string $studioHours,
        public readonly array $allowedOrigins,
        public readonly string $timezone,
        public readonly int $rateLimitAttempts,
        public readonly int $rateLimitWindowSeconds,
        public readonly bool $sendConfirmation,
    ) {
    }

    public static function fromEnvironment(Environment $env): self
    {
        $read = static fn (string $key, ?string $fallback = null): string => $env->get($key)
            ?? $fallback
            ?? throw new RuntimeException("Missing contact setting: {$key}. Add it to server/.env.");
        $siteUrl = rtrim($read('CONTACT_SITE_URL'), '/');

        return new self(
            brevoApiKey: $read('BREVO_API_KEY'),
            senderEmail: $read('CONTACT_SENDER_EMAIL'),
            senderName: $read('CONTACT_SENDER_NAME', 'The Minimalist — Design Studio'),
            studioEmail: $read('CONTACT_STUDIO_EMAIL'),
            studioName: $read('CONTACT_STUDIO_NAME', 'The Minimalist'),
            siteUrl: $siteUrl,
            logoUrl: $read('CONTACT_LOGO_URL', $siteUrl . '/email/lotus.png'),
            studioHours: $read('CONTACT_STUDIO_HOURS', '7:00 AM – 11:00 AM'),
            allowedOrigins: self::list($read('CONTACT_ALLOWED_ORIGINS', $siteUrl)),
            timezone: $read('CONTACT_TIMEZONE', 'Asia/Manila'),
            rateLimitAttempts: max(1, (int) $read('CONTACT_RATE_LIMIT_ATTEMPTS', '5')),
            rateLimitWindowSeconds: max(1, (int) $read('CONTACT_RATE_LIMIT_WINDOW', '900')),
            sendConfirmation: filter_var($read('CONTACT_SEND_CONFIRMATION', 'true'), FILTER_VALIDATE_BOOL),
        );
    }

    public function allowsOrigin(string $origin): bool
    {
        return in_array(rtrim($origin, '/'), $this->allowedOrigins, true);
    }

    /**
     * @return list<string>
     */
    private static function list(string $value): array
    {
        return array_values(array_filter(array_map(
            static fn (string $item): string => rtrim(trim($item), '/'),
            explode(',', $value),
        )));
    }
}
