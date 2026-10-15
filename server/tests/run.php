<?php

declare(strict_types=1);

use TheMinimalist\Contact\Application;
use TheMinimalist\Contact\Config\AppConfig;
use TheMinimalist\Contact\Config\Environment;
use TheMinimalist\Contact\Controllers\ContactController;
use TheMinimalist\Contact\Http\Request;
use TheMinimalist\Contact\Models\Inquiry;
use TheMinimalist\Contact\Models\InquiryKind;
use TheMinimalist\Contact\Models\InquiryValidator;
use TheMinimalist\Contact\Services\Http\HttpResponse;
use TheMinimalist\Contact\Services\InquiryNotifier;
use TheMinimalist\Contact\Services\Mail\BrevoMailer;
use TheMinimalist\Contact\Services\Mail\EmailAddress;
use TheMinimalist\Contact\Services\Mail\EmailMessage;
use TheMinimalist\Contact\Services\Mail\MailDeliveryException;
use TheMinimalist\Contact\Services\Security\FileRateLimiter;
use TheMinimalist\Contact\Tests\Assert;
use TheMinimalist\Contact\Tests\FixedRateLimiter;
use TheMinimalist\Contact\Tests\RecordingHttpClient;
use TheMinimalist\Contact\Tests\RecordingMailer;
use TheMinimalist\Contact\Views\InquiryEmailView;
use TheMinimalist\Contact\Views\TemplateRenderer;

use function TheMinimalist\Contact\Tests\config;

require dirname(__DIR__) . '/app/autoload.php';
require __DIR__ . '/Support.php';

date_default_timezone_set('Asia/Manila');

const TODAY = '2026-10-16';
const TEMPLATES = __DIR__ . '/../app/Views/templates';

$quote = [
    'kind' => 'quote',
    'name' => 'Ana Cruz',
    'email' => 'Ana@Example.com',
    'organisation' => 'Cebu Social Club',
    'service' => 'Branding identity',
    'timeline' => 'Flexible',
    'message' => "We are opening a café in Cebu.\nWe would love a warm brand.",
];

$today = static fn (): DateTimeImmutable => new DateTimeImmutable(TODAY);
$view = static fn (): InquiryEmailView => new InquiryEmailView(new TemplateRenderer(TEMPLATES), config());
$controller = static fn (RecordingMailer $mailer, bool $allow = true): ContactController => new ContactController(
    new InquiryValidator(),
    new InquiryNotifier($mailer, $view(), config()),
    new FixedRateLimiter($allow),
    config(),
    $today,
);
$request = static fn (array|string $body, array $headers = []): Request => new Request(
    'POST',
    ['content-type' => 'application/json', 'origin' => 'https://studio.test', ...$headers],
    is_string($body) ? $body : json_encode($body, JSON_THROW_ON_ERROR),
    '203.0.113.7',
);

$tests = [
    'the .env file supports comments, quotes, and export' => function (): void {
        $values = Environment::parse(<<<'ENV'
            # Brevo
            BREVO_API_KEY=xkeysib-123 # inline comment
            export CONTACT_SENDER_NAME="The Minimalist — Design Studio"
            CONTACT_STUDIO_HOURS='7:00 AM # 11:00 AM'

            CONTACT_EMPTY=
            ENV);
        Assert::same([
            'BREVO_API_KEY' => 'xkeysib-123',
            'CONTACT_SENDER_NAME' => 'The Minimalist — Design Studio',
            'CONTACT_STUDIO_HOURS' => '7:00 AM # 11:00 AM',
            'CONTACT_EMPTY' => '',
        ], $values);
        Assert::same(null, (new Environment($values))->get('CONTACT_EMPTY'));
        Assert::throws(RuntimeException::class, fn () => Environment::parse('not a setting'));
    },
    'settings come from the environment with sensible defaults' => function (): void {
        $config = AppConfig::fromEnvironment(new Environment([
            'BREVO_API_KEY' => 'key',
            'CONTACT_SENDER_EMAIL' => 'hello@studio.test',
            'CONTACT_STUDIO_EMAIL' => 'studio@studio.test',
            'CONTACT_SITE_URL' => 'https://studio.test/',
            'CONTACT_SEND_CONFIRMATION' => 'false',
        ]));
        Assert::same('https://studio.test/email/lotus.png', $config->logoUrl);
        Assert::same(['https://studio.test'], $config->allowedOrigins);
        Assert::same(false, $config->sendConfirmation);
        Assert::true($config->allowsOrigin('https://studio.test/'), 'Trailing slashes are ignored.');
        Assert::throws(RuntimeException::class, fn () => AppConfig::fromEnvironment(new Environment([])));
    },
    'a complete quote is valid' => function () use ($quote, $today): void {
        Assert::same([], (new InquiryValidator())->validate(Inquiry::fromArray($quote), $today()));
    },
    'each kind asks only for its own required fields' => function () use ($today): void {
        $errors = (new InquiryValidator())->validate(Inquiry::fromArray(['kind' => 'quote']), $today());
        Assert::same(['name', 'email', 'message', 'service'], array_keys($errors));
        $meeting = Inquiry::fromArray([
            'kind' => 'appointment', 'name' => 'Ana', 'email' => 'ana@example.com',
            'message' => 'Let us talk about a website.', 'date' => '2026-10-01',
        ]);
        $errors = (new InquiryValidator())->validate($meeting, $today());
        Assert::same('Please choose a date from today onward.', $errors['date'] ?? null);
        Assert::same('Please choose online or in person.', $errors['format'] ?? null);
        $impossible = Inquiry::fromArray([...$meeting->details(), 'kind' => 'appointment', 'date' => '2026-02-30']);
        Assert::same('Please choose a valid date.', (new InquiryValidator())->validate($impossible, $today())['date'] ?? null);
    },
    'inputs are cleaned and fields from other kinds are ignored' => function () use ($quote): void {
        $inquiry = Inquiry::fromArray([...$quote, 'kind' => 'general', 'name' => "Ana\r\nBcc: x@y.z", 'date' => '2030-01-01']);
        Assert::same(InquiryKind::General, $inquiry->kind);
        Assert::same('Ana Bcc: x@y.z', $inquiry->name);
        Assert::same('ana@example.com', $inquiry->email);
        Assert::same('', $inquiry->service);
        Assert::same('', $inquiry->date);
        Assert::same(InquiryKind::General, Inquiry::fromArray(['kind' => 'unknown'])->kind);
    },
    'templates escape values unless marked as pre-rendered markup' => function (): void {
        $dir = sys_get_temp_dir() . '/minimalist-templates-' . getmypid();
        @mkdir($dir);
        file_put_contents("{$dir}/sample.html", '<p>{{ name }}</p>{{{ block }}}');
        $renderer = new TemplateRenderer($dir);
        Assert::same('<p>&lt;b&gt;Ana&lt;/b&gt;</p><i>ok</i>', $renderer->render('sample.html', ['name' => '<b>Ana</b>', 'block' => '<i>ok</i>']));
        Assert::throws(LogicException::class, fn () => $renderer->render('sample.html', ['name' => 'Ana']));
        Assert::throws(LogicException::class, fn () => $renderer->render('../run.php', []));
    },
    'the studio email shows the brand, the message, and a reply link' => function () use ($quote, $view): void {
        $email = $view()->studioNotification(Inquiry::fromArray([...$quote, 'name' => 'Ana <script>']));
        Assert::same('Quote request from Ana <script> — Branding identity', $email->subject);
        Assert::contains('https://studio.test/email/lotus.png', $email->html);
        Assert::contains('THE MINIMALIST', $email->html);
        Assert::contains('Ana &lt;script&gt;', $email->html);
        Assert::true(!str_contains($email->html, '<script>'), 'Visitor input must be escaped.');
        Assert::contains('We are opening a café in Cebu.<br>', $email->html);
        Assert::contains('mailto:ana%40example.com?subject=Re%3A%20Quote%20request', $email->html);
        Assert::contains('Service: Branding identity', $email->text);
        Assert::true(!str_contains($email->text, '&lt;'), 'Plain text must not be HTML-escaped.');
    },
    'the visitor confirmation thanks them and repeats what they sent' => function () use ($quote, $view): void {
        $email = $view()->visitorConfirmation(Inquiry::fromArray($quote));
        Assert::same('We received your message — The Minimalist', $email->subject);
        Assert::contains('Thank you, Ana.', $email->html);
        Assert::contains('Cebu Social Club', $email->html);
        Assert::contains('7:00 AM – 11:00 AM', $email->text);
    },
    'Brevo receives the message with sender, recipient, and reply-to' => function (): void {
        $http = new RecordingHttpClient();
        (new BrevoMailer($http, 'secret'))->send(new EmailMessage(
            new EmailAddress('hello@studio.test', 'Studio'),
            new EmailAddress('ana@example.com'),
            'Subject',
            '<p>Hi</p>',
            'Hi',
            new EmailAddress('studio@studio.test'),
            ['contact'],
        ));
        $request = $http->requests[0];
        Assert::same('https://api.brevo.com/v3/smtp/email', $request['url']);
        Assert::same(['api-key' => 'secret'], $request['headers']);
        Assert::same(['email' => 'hello@studio.test', 'name' => 'Studio'], $request['json']['sender']);
        Assert::same([['email' => 'ana@example.com']], $request['json']['to']);
        Assert::same(['email' => 'studio@studio.test'], $request['json']['replyTo']);
        Assert::same(['contact'], $request['json']['tags']);
    },
    'a Brevo rejection becomes a delivery error' => function (): void {
        $mailer = new BrevoMailer(new RecordingHttpClient(new HttpResponse(401, '{"code":"unauthorized"}')), 'bad');
        Assert::throws(MailDeliveryException::class, fn () => $mailer->send(new EmailMessage(
            new EmailAddress('a@b.c'), new EmailAddress('d@e.f'), 'S', 'H', 'T',
        )));
    },
    'the rate limiter allows a few attempts per window' => function (): void {
        $now = 1_000;
        $limiter = new FileRateLimiter(sys_get_temp_dir() . '/minimalist-rate-' . getmypid() . '-' . mt_rand(), 2, 60, function () use (&$now): int {
            return $now;
        });
        Assert::same([true, true, false], [$limiter->attempt('ip'), $limiter->attempt('ip'), $limiter->attempt('ip')]);
        Assert::true($limiter->attempt('other-ip'), 'Limits are per client.');
        $now += 61;
        Assert::true($limiter->attempt('ip'), 'The window resets.');
    },
    'a valid message is sent to the studio and confirmed to the visitor' => function () use ($controller, $request, $quote): void {
        $mailer = new RecordingMailer();
        $response = $controller($mailer)->send($request($quote));
        Assert::same(202, $response->status);
        Assert::same(true, $response->payload['ok'] ?? null);
        Assert::same(2, count($mailer->sent));
        Assert::same('studio@studio.test', $mailer->sent[0]->to->email);
        Assert::same('ana@example.com', $mailer->sent[0]->replyTo?->email);
        Assert::same('ana@example.com', $mailer->sent[1]->to->email);
    },
    'invalid messages return field errors without sending' => function () use ($controller, $request): void {
        $mailer = new RecordingMailer();
        $response = $controller($mailer)->send($request(['kind' => 'quote', 'name' => 'Ana']));
        Assert::same(422, $response->status);
        Assert::same(['email', 'message', 'service'], array_keys($response->payload['errors'] ?? []));
        Assert::same(0, count($mailer->sent));
    },
    'spam traps, floods, bad origins, and bad bodies are refused' => function () use ($controller, $request, $quote): void {
        $mailer = new RecordingMailer();
        Assert::same(202, $controller($mailer)->send($request([...$quote, 'website' => 'http://spam'])) ->status);
        Assert::same(0, count($mailer->sent), 'The honeypot never sends.');
        Assert::same(429, $controller($mailer, allow: false)->send($request($quote))->status);
        Assert::same(403, $controller($mailer)->send($request($quote, ['origin' => 'https://evil.test']))->status);
        Assert::same(415, $controller($mailer)->send($request($quote, ['content-type' => 'text/plain']))->status);
        Assert::same(400, $controller($mailer)->send($request('{not json'))->status);
        Assert::same(413, $controller($mailer)->send($request(str_repeat('x', 20_000)))->status);
    },
    'a mail failure is reported without leaking details' => function () use ($controller, $request, $quote): void {
        $log = ini_set('error_log', sys_get_temp_dir() . '/minimalist-contact-test.log');
        $response = $controller(new RecordingMailer(fail: true))->send($request($quote));
        ini_set('error_log', (string) $log);
        Assert::same(502, $response->status);
        Assert::true(!str_contains(json_encode($response->payload) ?: '', 'unavailable'), 'Internal errors stay in the log.');
    },
    'the application answers preflight for allowed origins only' => function () use ($controller): void {
        $app = new Application($controller(new RecordingMailer()), config());
        $preflight = $app->handle(new Request('OPTIONS', ['origin' => 'https://studio.test'], '', '1.1.1.1'));
        Assert::same(204, $preflight->status);
        Assert::same('https://studio.test', $preflight->headers['Access-Control-Allow-Origin'] ?? null);
        $foreign = $app->handle(new Request('OPTIONS', ['origin' => 'https://evil.test'], '', '1.1.1.1'));
        Assert::same(null, $foreign->headers['Access-Control-Allow-Origin'] ?? null);
        Assert::same(405, $app->handle(new Request('GET', [], '', '1.1.1.1'))->status);
    },
];

$failed = 0;
foreach ($tests as $name => $test) {
    try {
        $test();
        echo "  ✓ {$name}\n";
    } catch (Throwable $error) {
        $failed++;
        echo "  ✗ {$name}\n    {$error->getMessage()}\n";
    }
}
printf("\n%d passed, %d failed\n", count($tests) - $failed, $failed);
exit($failed === 0 ? 0 : 1);
