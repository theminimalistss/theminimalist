<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Views;

use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Models\Inquiry;
use TheMinimalist\Contact\Models\InquiryKind;

final class InquiryEmailView
{
    public function __construct(
        private readonly TemplateRenderer $renderer,
        private readonly AppConfig $config,
    ) {
    }

    public function studioNotification(Inquiry $inquiry): RenderedEmail
    {
        $subject = $this->studioSubject($inquiry);
        $data = [
            ...$this->inquiryData($inquiry),
            'reply_url' => 'mailto:' . rawurlencode($inquiry->email)
                . '?subject=' . rawurlencode("Re: {$subject}"),
        ];

        return $this->compose(
            $subject,
            'emails/studio-inquiry',
            $data,
            "{$inquiry->name} {$inquiry->kind->headline()} {$this->excerpt($inquiry->message)}",
        );
    }

    public function visitorConfirmation(Inquiry $inquiry): RenderedEmail
    {
        return $this->compose(
            "We received your message — {$this->config->studioName}",
            'emails/visitor-confirmation',
            $this->inquiryData($inquiry),
            "Thank you, {$inquiry->firstName()}. Your message is with the studio.",
        );
    }

    /**
     * @param array<string, string> $data
     */
    private function compose(string $subject, string $template, array $data, string $preheader): RenderedEmail
    {
        $shared = [
            'subject' => $subject,
            'preheader' => $preheader,
            'logo_url' => $this->config->logoUrl,
            'site_url' => $this->config->siteUrl,
            'site_host' => (string) (parse_url($this->config->siteUrl, PHP_URL_HOST) ?: $this->config->siteUrl),
            'studio_name' => $this->config->studioName,
            'studio_email' => $this->config->studioEmail,
            'studio_hours' => $this->config->studioHours,
            'year' => date('Y'),
        ];
        $data = [...$shared, ...$data];

        return new RenderedEmail(
            $subject,
            $this->renderer->render('emails/layout.html', [
                ...$shared,
                'content' => $this->renderer->render("{$template}.html", $data),
            ]),
            $this->renderer->render("{$template}.txt", $data, escape: false),
        );
    }

    /**
     * @return array<string, string>
     */
    private function inquiryData(Inquiry $inquiry): array
    {
        $details = $inquiry->details();

        return [
            'kind_label' => $inquiry->kind->label(),
            'name' => $inquiry->name,
            'first_name' => $inquiry->firstName(),
            'email' => $inquiry->email,
            'headline' => $inquiry->kind->headline(),
            'detail_rows' => implode('', array_map(
                fn (string $label, string $value): string => $this->renderer->render(
                    'emails/partials/detail-row.html',
                    ['label' => $label, 'value' => $value],
                ),
                array_keys($details),
                $details,
            )),
            'details_text' => implode("\n", array_map(
                static fn (string $label, string $value): string => "{$label}: {$value}",
                array_keys($details),
                $details,
            )),
            'message_html' => nl2br(TemplateRenderer::escape($inquiry->message), false),
            'message' => $inquiry->message,
            'next_step' => match ($inquiry->kind) {
                InquiryKind::Quote => 'We will look over the scope and reply with questions or a considered estimate.',
                InquiryKind::Appointment => 'We will confirm a time that suits you, or suggest the nearest alternative.',
                InquiryKind::General => 'We read every message and will reply personally.',
            },
        ];
    }

    private function studioSubject(Inquiry $inquiry): string
    {
        $prefix = match ($inquiry->kind) {
            InquiryKind::General => 'Hello from',
            InquiryKind::Quote => 'Quote request from',
            InquiryKind::Appointment => 'Meeting request from',
        };
        $detail = match ($inquiry->kind) {
            InquiryKind::Quote => $inquiry->service,
            InquiryKind::Appointment => $inquiry->date,
            InquiryKind::General => '',
        };

        return trim("{$prefix} {$inquiry->name}" . ($detail === '' ? '' : " — {$detail}"));
    }

    private function excerpt(string $message): string
    {
        $line = preg_replace('/\s+/', ' ', $message) ?? $message;

        return mb_strlen($line) > 90 ? mb_substr($line, 0, 89) . '…' : $line;
    }
}
