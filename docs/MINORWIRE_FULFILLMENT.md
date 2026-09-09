# MinorWire fulfillment (Stripe + SpoSched Resend)

## Flow

1. Customer pays via PayNow Payment Link
2. Stripe redirects to `/minorwire/thanks?session_id={CHECKOUT_SESSION_ID}`
3. Thanks page download hits `/api/minorwire/download?session_id=...` (verifies paid session)
4. Webhook `checkout.session.completed` calls SpoSched Supabase Edge Function
   `minorwire-fulfillment`, which sends email with the **same Resend keys** as
   `/sposched` trial signup (`RESEND_API_KEY` / `RESEND_FROM`)
5. BCC: `info@jittee.com`, `mobilejoz@gmail.com`, `johji_yamada@jittee.com`

## Secrets

### Firebase App Hosting (`jittee`)

| Secret | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Live secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `MINORWIRE_DOWNLOAD_SECRET` | HMAC for email download tokens |
| `MINORWIRE_FULFILLMENT_SECRET` | Shared auth for mail Edge Function |

Runtime env in `apphosting.yaml`:

- `MINORWIRE_PUBLIC_BASE_URL=https://jittee.com`
- `MINORWIRE_MAIL_ENDPOINT=https://yyeleqhfbbjnscaddutx.supabase.co/functions/v1/minorwire-fulfillment`

### SpoSched Supabase (`yyeleqhfbbjnscaddutx`)

Already used by trial-signup:

- `RESEND_API_KEY`
- `RESEND_FROM` (e.g. `SpoSched <noreply@jittee.com>`)

Also set:

- `MINORWIRE_FULFILLMENT_SECRET` (same value as Firebase)

Deploy function:

```bash
cd ShootLiff
npx supabase functions deploy minorwire-fulfillment --no-verify-jwt --project-ref yyeleqhfbbjnscaddutx
```

## Package ZIP

`private/minorwire/minorwire-cli.zip` is the customer package (no `node_modules`).
Rebuild from the MinorWire repo when shipping CLI changes.
