<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Models;

enum InquiryKind: string
{
    case General = 'general';
    case Quote = 'quote';
    case Appointment = 'appointment';

    public function label(): string
    {
        return match ($this) {
            self::General => 'Say hello',
            self::Quote => 'Request a quote',
            self::Appointment => 'Book a meeting',
        };
    }

    public function headline(): string
    {
        return match ($this) {
            self::General => 'would like to say hello.',
            self::Quote => 'would like a quote.',
            self::Appointment => 'would like to meet.',
        };
    }
}
