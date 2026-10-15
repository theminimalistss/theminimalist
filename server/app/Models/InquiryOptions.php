<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Models;

final class InquiryOptions
{
    public const SERVICES = [
        'Branding identity',
        'Website development',
        'Software development',
        'Website template',
        'Not sure yet',
    ];

    public const TIMELINES = ['As soon as possible', 'Within 1–3 months', 'In 3+ months', 'Flexible'];

    public const TIMES = ['Early morning', 'Late morning', 'Any time in studio hours'];

    public const FORMATS = ['Online', 'In person'];
}
