<?php

declare(strict_types=1);

namespace TheMinimalist\Contact\Models;

use DateTimeImmutable;

final class InquiryValidator
{
    private const MAX_LINE = 160;
    private const MIN_MESSAGE = 10;
    private const MAX_MESSAGE = 5000;

    /**
     * @return array<string, string> Field => message, empty when the inquiry is valid.
     */
    public function validate(Inquiry $inquiry, DateTimeImmutable $today): array
    {
        $errors = [
            ...$this->validateContact($inquiry),
            ...$this->validateMessage($inquiry),
        ];

        return match ($inquiry->kind) {
            InquiryKind::Quote => [...$errors, ...$this->validateQuote($inquiry)],
            InquiryKind::Appointment => [...$errors, ...$this->validateMeeting($inquiry, $today)],
            InquiryKind::General => $errors,
        };
    }

    /**
     * @return array<string, string>
     */
    private function validateContact(Inquiry $inquiry): array
    {
        $errors = [];
        if ($inquiry->name === '') {
            $errors['name'] = 'Please add your name.';
        } elseif (mb_strlen($inquiry->name) > self::MAX_LINE) {
            $errors['name'] = 'Please shorten your name.';
        }
        if ($inquiry->email === '') {
            $errors['email'] = 'Please add your email.';
        } elseif (filter_var($inquiry->email, FILTER_VALIDATE_EMAIL) === false) {
            $errors['email'] = 'Please check your email address.';
        }
        if (mb_strlen($inquiry->organisation) > self::MAX_LINE) {
            $errors['organisation'] = 'Please shorten the organisation name.';
        }

        return $errors;
    }

    /**
     * @return array<string, string>
     */
    private function validateMessage(Inquiry $inquiry): array
    {
        $length = mb_strlen($inquiry->message);

        return match (true) {
            $length < self::MIN_MESSAGE => ['message' => 'Please write a few words about it.'],
            $length > self::MAX_MESSAGE => ['message' => 'Please keep your message under 5,000 characters.'],
            default => [],
        };
    }

    /**
     * @return array<string, string>
     */
    private function validateQuote(Inquiry $inquiry): array
    {
        $errors = [];
        if (!in_array($inquiry->service, InquiryOptions::SERVICES, true)) {
            $errors['service'] = 'Please choose a service.';
        }
        if ($inquiry->timeline !== '' && !in_array($inquiry->timeline, InquiryOptions::TIMELINES, true)) {
            $errors['timeline'] = 'Please choose a timeline.';
        }
        if (mb_strlen($inquiry->budget) > self::MAX_LINE) {
            $errors['budget'] = 'Please shorten the budget.';
        }

        return $errors;
    }

    /**
     * @return array<string, string>
     */
    private function validateMeeting(Inquiry $inquiry, DateTimeImmutable $today): array
    {
        $errors = [];
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $inquiry->date);
        if ($inquiry->date === '') {
            $errors['date'] = 'Please choose a date.';
        } elseif ($date === false || $date->format('Y-m-d') !== $inquiry->date) {
            $errors['date'] = 'Please choose a valid date.';
        } elseif ($date < $today->setTime(0, 0)) {
            $errors['date'] = 'Please choose a date from today onward.';
        }
        if ($inquiry->time !== '' && !in_array($inquiry->time, InquiryOptions::TIMES, true)) {
            $errors['time'] = 'Please choose a time.';
        }
        if (!in_array($inquiry->format, InquiryOptions::FORMATS, true)) {
            $errors['format'] = 'Please choose online or in person.';
        }

        return $errors;
    }
}
