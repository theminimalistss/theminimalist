<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Services\Mail;

final class EmailAddress
{
    public function __construct(
        public readonly string $email,
        public readonly string $name = '',
    ) {
    }

    /**
     * @return array{email: string, name?: string}
     */
    public function toArray(): array
    {
        return $this->name === '' ? ['email' => $this->email] : ['email' => $this->email, 'name' => $this->name];
    }
}
