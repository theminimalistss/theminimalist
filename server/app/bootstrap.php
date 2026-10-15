<?php

declare(strict_types=1);

use TheMinimalist\Contact\Application;
use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Config\Environment;
use TheMinimalist\Contact\Controllers\ContactController;
use TheMinimalist\Contact\Models\InquiryValidator;
use TheMinimalist\Contact\Services\Http\CurlHttpClient;
use TheMinimalist\Contact\Services\InquiryNotifier;
use TheMinimalist\Contact\Services\Mail\BrevoMailer;
use TheMinimalist\Contact\Services\Security\FileRateLimiter;
use TheMinimalist\Contact\Views\InquiryEmailView;
use TheMinimalist\Contact\Views\TemplateRenderer;

require __DIR__ . '/autoload.php';

$config = AppConfig::fromEnvironment(Environment::load(
    dirname(__DIR__) . '/.env',
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__, 3) . '/.env',
));

date_default_timezone_set($config->timezone);

$notifier = new InquiryNotifier(
    new BrevoMailer(new CurlHttpClient(), $config->brevoApiKey),
    new InquiryEmailView(new TemplateRenderer(__DIR__ . '/Views/templates'), $config),
    $config,
);

return new Application(
    new ContactController(
        new InquiryValidator(),
        $notifier,
        new FileRateLimiter(
            dirname(__DIR__) . '/storage/rate-limits',
            $config->rateLimitAttempts,
            $config->rateLimitWindowSeconds,
        ),
        $config,
    ),
    $config,
);
