# Contact mail service

A small PHP 8.1+ service that receives the Contact form and sends it through
[Brevo](https://www.brevo.com/)'s transactional email API. It has no Composer
dependencies and only needs the `curl` and `json` extensions.

```
public/index.php      front controller (the only web entry point)
app/bootstrap.php     wiring: config → services → controller
app/Controllers/      ContactController (HTTP flow)
app/Models/           Inquiry, InquiryKind, InquiryValidator, InquiryOptions
app/Views/            TemplateRenderer, InquiryEmailView, templates/emails/*.html|.txt
app/Services/         InquiryNotifier, Mail/BrevoMailer, Http/CurlHttpClient, Security/FileRateLimiter
app/Config/           Environment (.env loader), AppConfig
storage/              rate-limit files (must be writable)
tests/run.php         dependency-free test runner
```

Request flow: `POST /` with JSON → origin, content-type, size, and spam-trap checks →
validation (`422` with field errors) → per-IP rate limit (`429`) → studio
notification (Reply-To: the visitor) and a branded confirmation to the visitor
→ `202`. Brevo failures are logged and returned as `502` without details.

The email designs live in `app/Views/templates/emails/`. Values are HTML-escaped by
default (`{{ value }}`); only pre-rendered markup uses `{{{ value }}}`. The lotus logo
is `public/email/lotus.png` on the website (`npm run media:email-logo` regenerates
it), so the site must be deployed for the logo to appear in emails.

## Configuration (.env)

Copy `.env.example` to a `.env` file and fill it in. The service looks for `.env` in
its own folder, then one and two folders up: on a host, the folder above
`public_html`; locally, the repository's root `.env`. Host variables take
precedence.

| Variable                                  | Required | Notes                                               |
| ----------------------------------------- | -------- | --------------------------------------------------- |
| `BREVO_API_KEY`                           | yes      | Brevo → SMTP & API → API keys. Never commit it.     |
| `CONTACT_SENDER_EMAIL`                    | yes      | A sender or domain verified in Brevo.               |
| `CONTACT_STUDIO_EMAIL`                    | yes      | Where new messages are delivered.                   |
| `CONTACT_SITE_URL`                        | yes      | The public website, e.g. `https://www.example.com`. |
| `CONTACT_ALLOWED_ORIGINS`                 | no       | Comma-separated; defaults to `CONTACT_SITE_URL`.    |
| `CONTACT_LOGO_URL`                        | no       | Defaults to `CONTACT_SITE_URL/email/lotus.png`.     |
| `CONTACT_SEND_CONFIRMATION`               | no       | `true` (default) sends the visitor a confirmation.  |
| `CONTACT_RATE_LIMIT_ATTEMPTS` / `_WINDOW` | no       | Defaults: 5 messages per 900 seconds per IP.        |

### Brevo checklist

1. Verify the sender address, or better, authenticate your domain (SPF/DKIM)
   under **Senders, domains & dedicated IPs**. A Gmail sender is delivered poorly
   because of Gmail's DMARC policy; use an address on your own domain.
2. Brevo blocks API calls from unknown IP addresses by default. Under
   **Security → Authorised IPs**, add your hosting server's outgoing IP (shown in
   the hosting panel or in the error log after a first attempt), or deactivate
   the IP restriction.

## Run locally

```sh
npm run api:dev        # http://127.0.0.1:8787
npm run test:php
```

Put `VITE_CONTACT_ENDPOINT=http://127.0.0.1:8787` in `.env.development.local` so
`npm run dev` posts to it, and add `http://127.0.0.1:5173` to
`CONTACT_ALLOWED_ORIGINS`.

## Deploy

The website and this service deploy separately. The website stays a static build
(Hostinger Web App); this service runs on a PHP subdomain such as
`api.example.com`.

1. Run `npm run build:api`. It writes `dist-api/` with only the runtime files
   (`.htaccess`, `app/`, `public/`, `storage/`, `.env.example`); tests, docs, and
   secrets are left out.
2. Create the subdomain and upload everything in `dist-api/` into its
   `public_html`. Check that both `.htaccess` files arrived; some uploaders skip
   dotfiles. The root `.htaccess` routes every request to `public/index.php` and
   blocks `.env`, `app/`, and `storage/`.
3. Create `.env` from `.env.example` in the folder **above** that `public_html`, so
   it is never web-accessible. (`public_html/.env` also works and is blocked by
   `.htaccess`.) Set `CONTACT_SITE_URL` and `CONTACT_ALLOWED_ORIGINS` to the
   website's exact origins, e.g. `https://example.com,https://www.example.com`.
4. Choose PHP 8.1+ with `curl` for the subdomain.
5. Rebuild and redeploy the website with
   `VITE_CONTACT_ENDPOINT=https://api.example.com/` (Vite bakes it into the build;
   on Hostinger, set it in the Web App's environment variables).

**Hostinger.** Create the subdomain under **Domains → Subdomains** and open its
File Manager (not the main Web App's, whose `public_html` is replaced on each
deployment). Choose PHP under **Advanced → PHP Configuration**.

**GoDaddy.** Use Linux hosting with cPanel (not Windows/Plesk or Website Builder).
Create the subdomain under **Domains**, upload to its document root, and choose
PHP 8.1+ in **Select PHP Version** with `curl` enabled.

### After deploying

```sh
curl -i https://api.example.com/        # 405 JSON: PHP is running
curl -i https://api.example.com/.env    # 403 or 405, never the file
```

Add the server's IP to Brevo's authorised IPs, then send a real message from the
website and confirm both emails arrive.
