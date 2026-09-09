# MinorWire fulfillment (Stripe)

## Flow

1. Customer pays via PayNow Payment Link
2. Stripe redirects to `/minorwire/thanks?session_id={CHECKOUT_SESSION_ID}`
3. Thanks page download hits `/api/minorwire/download?session_id=...` (verifies paid session)
4. Webhook `checkout.session.completed` emails a 7-day signed download link (Resend)

## Secrets (Firebase App Hosting / Secret Manager)

| Secret | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Live secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `MINORWIRE_DOWNLOAD_SECRET` | HMAC for email download tokens |
| `RESEND_API_KEY` | Outbound email (optional for page download; required for auto-mail) |

Also set runtime env (already in `apphosting.yaml`):

- `MINORWIRE_PUBLIC_BASE_URL=https://jittee.com`
- `MINORWIRE_MAIL_FROM` (use a Resend-verified domain in production)
- `MINORWIRE_MAIL_BCC=info@jittee.com,mobilejoz@gmail.com`

## Create webhook (once)

```bash
stripe webhook_endpoints create --live \
  -d "url=https://jittee.com/api/stripe/webhook" \
  -d "enabled_events[0]=checkout.session.completed"
```

Save the returned `secret` as `STRIPE_WEBHOOK_SECRET`.

## Package ZIP

`private/minorwire/minorwire-cli.zip` is the customer package (no `node_modules`). Rebuild from the MinorWire repo when shipping CLI changes.
