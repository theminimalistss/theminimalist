<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Views;

use LogicException;

/**
 * Renders plain .html/.txt templates. {{ name }} is HTML-escaped; {{{ name }}} inserts
 * markup the view has already escaped. Unknown placeholders fail loudly.
 */
final class TemplateRenderer
{
    private const PLACEHOLDER = '/\{\{\{\s*([a-z_]+)\s*\}\}\}|\{\{\s*([a-z_]+)\s*\}\}/';

    public function __construct(private readonly string $directory)
    {
    }

    /**
     * @param array<string, string> $data
     */
    public function render(string $template, array $data, bool $escape = true): string
    {
        $source = file_get_contents($this->path($template));
        if ($source === false) {
            throw new LogicException("Email template not readable: {$template}");
        }

        return (string) preg_replace_callback(
            self::PLACEHOLDER,
            function (array $match) use ($data, $template, $escape): string {
                $raw = ($match[1] ?? '') !== '';
                $name = $raw ? $match[1] : $match[2];
                if (!array_key_exists($name, $data)) {
                    throw new LogicException("Missing value for {{ {$name} }} in {$template}");
                }

                return $raw || !$escape ? $data[$name] : self::escape($data[$name]);
            },
            $source,
        );
    }

    public static function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    private function path(string $template): string
    {
        $base = realpath($this->directory);
        $path = realpath($this->directory . '/' . $template);
        if ($base === false || $path === false || !str_starts_with($path, $base . DIRECTORY_SEPARATOR)) {
            throw new LogicException("Unknown email template: {$template}");
        }

        return $path;
    }
}
