<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Security;

final class FileRateLimiter implements RateLimiter
{
    public function __construct(
        private readonly string $directory,
        private readonly int $maxAttempts,
        private readonly int $windowSeconds,
        private readonly ?\Closure $clock = null,
    ) {
    }

    public function attempt(string $key): bool
    {
        if (!is_dir($this->directory) && !mkdir($this->directory, 0o750, true) && !is_dir($this->directory)) {
            return true;
        }

        $handle = fopen($this->directory . '/' . hash('sha256', $key) . '.json', 'c+');
        if ($handle === false) {
            return true;
        }

        try {
            flock($handle, LOCK_EX);
            $now = $this->now();
            $stored = json_decode((string) stream_get_contents($handle), true);
            $recent = array_values(array_filter(
                is_array($stored) ? $stored : [],
                fn (mixed $time): bool => is_int($time) && $time > $now - $this->windowSeconds,
            ));
            $allowed = count($recent) < $this->maxAttempts;
            if ($allowed) {
                $recent[] = $now;
            }
            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode($recent, JSON_THROW_ON_ERROR));

            return $allowed;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    private function now(): int
    {
        return $this->clock !== null ? ($this->clock)() : time();
    }
}
