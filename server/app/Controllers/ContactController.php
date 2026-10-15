<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Controllers;

use Closure;
use DateTimeImmutable;
use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Http\JsonResponse;
use TheMinimalist\Contact\Http\Request;
use TheMinimalist\Contact\Models\Inquiry;
use TheMinimalist\Contact\Models\InquiryValidator;
use TheMinimalist\Contact\Services\InquiryNotifier;
use TheMinimalist\Contact\Services\Mail\MailDeliveryException;
use TheMinimalist\Contact\Services\Security\RateLimiter;

final class ContactController
{
    private const MAX_BODY_BYTES = 16_384;
    private const HONEYPOT_FIELD = 'website';

    public function __construct(
        private readonly InquiryValidator $validator,
        private readonly InquiryNotifier $notifier,
        private readonly RateLimiter $limiter,
        private readonly AppConfig $config,
        private readonly ?Closure $today = null,
    ) {
    }

    public function send(Request $request): JsonResponse
    {
        $rejection = $this->rejectUnacceptable($request);
        if ($rejection !== null) {
            return $rejection;
        }

        $input = $request->json();
        if ($input === null) {
            return JsonResponse::error(400, 'The message could not be read.');
        }
        if (trim((string) ($input[self::HONEYPOT_FIELD] ?? '')) !== '') {
            return $this->accepted();
        }

        $inquiry = Inquiry::fromArray($input);
        $errors = $this->validator->validate($inquiry, $this->today());
        if ($errors !== []) {
            return JsonResponse::error(422, 'Please check the highlighted fields.', $errors);
        }
        if (!$this->limiter->attempt($request->clientIp)) {
            return JsonResponse::error(429, 'Too many messages in a short time. Please try again later.')
                ->withHeader('Retry-After', (string) $this->config->rateLimitWindowSeconds);
        }

        try {
            $this->notifier->notify($inquiry);
        } catch (MailDeliveryException $error) {
            error_log('Contact message not sent: ' . $error->getMessage());

            return JsonResponse::error(502, 'Your message could not be sent right now. Please email the studio directly.');
        }

        return $this->accepted();
    }

    private function rejectUnacceptable(Request $request): ?JsonResponse
    {
        $origin = $request->header('Origin');

        return match (true) {
            $origin !== null && !$this->config->allowsOrigin($origin) =>
                JsonResponse::error(403, 'Messages are not accepted from this site.'),
            !$request->isJson() => JsonResponse::error(415, 'Please send the message as JSON.'),
            strlen($request->body) > self::MAX_BODY_BYTES => JsonResponse::error(413, 'The message is too long.'),
            default => null,
        };
    }

    private function accepted(): JsonResponse
    {
        return JsonResponse::ok(['ok' => true, 'message' => 'Thank you. Your message is on its way.'], 202);
    }

    private function today(): DateTimeImmutable
    {
        return $this->today !== null ? ($this->today)() : new DateTimeImmutable('today');
    }
}
