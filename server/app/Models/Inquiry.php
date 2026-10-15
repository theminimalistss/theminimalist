<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Models;

final class Inquiry
{
    public function __construct(
        public readonly InquiryKind $kind,
        public readonly string $name,
        public readonly string $email,
        public readonly string $organisation,
        public readonly string $message,
        public readonly string $service = '',
        public readonly string $timeline = '',
        public readonly string $budget = '',
        public readonly string $date = '',
        public readonly string $time = '',
        public readonly string $format = '',
    ) {
    }

    /**
     * @param array<string, mixed> $input
     */
    public static function fromArray(array $input): self
    {
        $line = static fn (string $key): string => self::singleLine($input[$key] ?? '');
        $kind = InquiryKind::tryFrom($line('kind')) ?? InquiryKind::General;

        return new self(
            kind: $kind,
            name: $line('name'),
            email: strtolower($line('email')),
            organisation: $line('organisation'),
            message: self::paragraphs($input['message'] ?? ''),
            service: $kind === InquiryKind::Quote ? $line('service') : '',
            timeline: $kind === InquiryKind::Quote ? $line('timeline') : '',
            budget: $kind === InquiryKind::Quote ? $line('budget') : '',
            date: $kind === InquiryKind::Appointment ? $line('date') : '',
            time: $kind === InquiryKind::Appointment ? $line('time') : '',
            format: $kind === InquiryKind::Appointment ? $line('format') : '',
        );
    }

    public function firstName(): string
    {
        return explode(' ', $this->name)[0] ?? $this->name;
    }

    /**
     * @return array<string, string> Label => value, without empty values.
     */
    public function details(): array
    {
        return array_filter([
            'Name' => $this->name,
            'Email' => $this->email,
            'Organisation' => $this->organisation,
            'Service' => $this->service,
            'Timeline' => $this->timeline,
            'Budget' => $this->budget,
            'Preferred date' => $this->formattedDate(),
            'Preferred time' => $this->time,
            'Meeting' => $this->format,
        ], static fn (string $value): bool => $value !== '');
    }

    public function formattedDate(): string
    {
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $this->date);

        return $date === false ? $this->date : $date->format('l, j F Y');
    }

    private static function singleLine(mixed $value): string
    {
        $text = is_scalar($value) ? (string) $value : '';

        return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $text));
    }

    private static function paragraphs(mixed $value): string
    {
        $text = is_scalar($value) ? (string) $value : '';
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        return trim((string) preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $text));
    }
}
