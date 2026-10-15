<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services;

use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Models\Inquiry;
use TheMinimalist\Contact\Services\Mail\EmailAddress;
use TheMinimalist\Contact\Services\Mail\EmailMessage;
use TheMinimalist\Contact\Services\Mail\Mailer;
use TheMinimalist\Contact\Services\Mail\MailDeliveryException;
use TheMinimalist\Contact\Views\InquiryEmailView;

final class InquiryNotifier
{
    public function __construct(
        private readonly Mailer $mailer,
        private readonly InquiryEmailView $view,
        private readonly AppConfig $config,
    ) {
    }

    /**
     * Sends the inquiry to the studio and, when enabled, a confirmation to the sender.
     *
     * @throws MailDeliveryException When the studio notification cannot be sent.
     */
    public function notify(Inquiry $inquiry): void
    {
        $studio = $this->view->studioNotification($inquiry);
        $this->mailer->send(new EmailMessage(
            from: $this->sender(),
            to: new EmailAddress($this->config->studioEmail, $this->config->studioName),
            subject: $studio->subject,
            html: $studio->html,
            text: $studio->text,
            replyTo: new EmailAddress($inquiry->email, $inquiry->name),
            tags: ['contact', $inquiry->kind->value],
        ));

        if ($this->config->sendConfirmation) {
            $this->sendConfirmation($inquiry);
        }
    }

    private function sendConfirmation(Inquiry $inquiry): void
    {
        $confirmation = $this->view->visitorConfirmation($inquiry);
        try {
            $this->mailer->send(new EmailMessage(
                from: $this->sender(),
                to: new EmailAddress($inquiry->email, $inquiry->name),
                subject: $confirmation->subject,
                html: $confirmation->html,
                text: $confirmation->text,
                replyTo: new EmailAddress($this->config->studioEmail, $this->config->studioName),
                tags: ['contact-confirmation'],
            ));
        } catch (MailDeliveryException $error) {
            error_log('Contact confirmation not sent: ' . $error->getMessage());
        }
    }

    private function sender(): EmailAddress
    {
        return new EmailAddress($this->config->senderEmail, $this->config->senderName);
    }
}
