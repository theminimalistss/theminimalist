<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Mail;

final class EmailMessage
{
    /**
     * @param list<string> $tags
     */
    public function __construct(
        public readonly EmailAddress $from,
        public readonly EmailAddress $to,
        public readonly string $subject,
        public readonly string $html,
        public readonly string $text,
        public readonly ?EmailAddress $replyTo = null,
        public readonly array $tags = [],
    ) {
    }
}
