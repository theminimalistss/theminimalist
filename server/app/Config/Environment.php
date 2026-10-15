<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Config;

use RuntimeException;

final class Environment
{
    private const LINE = '/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/';

    /**
     * @param array<string, string> $values
     */
    public function __construct(private readonly array $values)
    {
    }

    public static function load(string ...$files): self
    {
        $values = [];
        foreach (array_reverse($files) as $file) {
            if (is_file($file)) {
                $values = [...$values, ...array_filter(self::parse((string) file_get_contents($file)))];
            }
        }
        $fromServer = array_filter(getenv(), static fn (string $value): bool => $value !== '');

        return new self([...$values, ...$fromServer]);
    }

    /**
     * @return array<string, string>
     */
    public static function parse(string $contents): array
    {
        $values = [];
        $lines = preg_split('/\R/', $contents) ?: [];
        foreach ($lines as $number => $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            if (!preg_match(self::LINE, $line, $match)) {
                throw new RuntimeException('Invalid .env line ' . ($number + 1) . '.');
            }
            $values[$match[1]] = self::value($match[2]);
        }

        return $values;
    }

    public function get(string $key): ?string
    {
        $value = $this->values[$key] ?? '';

        return $value === '' ? null : $value;
    }

    private static function value(string $raw): string
    {
        $quote = $raw[0] ?? '';
        if (($quote === '"' || $quote === "'") && preg_match('/^' . $quote . '(.*)' . $quote . '/', $raw, $match)) {
            return $quote === '"'
                ? strtr($match[1], ['\\n' => "\n", '\\"' => '"', '\\\\' => '\\'])
                : $match[1];
        }

        return trim((string) preg_replace('/\s+#.*$/', '', $raw));
    }
}
