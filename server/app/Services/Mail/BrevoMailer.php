<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Mail;

use Throwable;
use TheMinimalist\Contact\Services\Http\HttpClient;

final class BrevoMailer implements Mailer
{
    private const ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

    public function __construct(
        private readonly HttpClient $http,
        private readonly string $apiKey,
    ) {
    }

    public function send(EmailMessage $message): void
    {
        try {
            $response = $this->http->postJson(self::ENDPOINT, ['api-key' => $this->apiKey], $this->payload($message));
        } catch (Throwable $error) {
            throw new MailDeliveryException($error->getMessage(), previous: $error);
        }

        if (!$response->isSuccessful()) {
            throw new MailDeliveryException("Brevo rejected the message ({$response->status}): {$response->body}");
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(EmailMessage $message): array
    {
        $payload = [
            'sender' => $message->from->toArray(),
            'to' => [$message->to->toArray()],
            'subject' => $message->subject,
            'htmlContent' => $message->html,
            'textContent' => $message->text,
        ];
        if ($message->replyTo !== null) {
            $payload['replyTo'] = $message->replyTo->toArray();
        }
        if ($message->tags !== []) {
            $payload['tags'] = $message->tags;
        }

        return $payload;
    }
}
