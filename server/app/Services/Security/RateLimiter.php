<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Security;

interface RateLimiter
{
    /**
     * Records an attempt for the key and reports whether it is still within the limit.
     */
    public function attempt(string $key): bool;
}
