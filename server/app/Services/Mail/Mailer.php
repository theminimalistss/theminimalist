<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Mail;

interface Mailer
{
    /**
     * @throws MailDeliveryException When the message could not be accepted for delivery.
     */
    public function send(EmailMessage $message): void;
}
