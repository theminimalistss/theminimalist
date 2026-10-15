<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Views;

final class RenderedEmail
{
    public function __construct(
        public readonly string $subject,
        public readonly string $html,
        public readonly string $text,
    ) {
    }
}
