# MinorWire fulfillment (hosted wizard)

## Flow

1. Customer pays via PayNow Payment Link
2. Stripe redirects to `/minorwire/thanks?session_id={CHECKOUT_SESSION_ID}`
3. Customer opens `/minorwire/setup?session_id=...` and pastes least-privilege OCI credentials
4. `POST /api/minorwire/jobs` verifies Stripe payment, creates a Firestore job (no PEM stored)
5. Internal `POST /api/minorwire/jobs/[id]/run` provisions on App Hosting (OCI + SSH)
6. UI polls job status and shows `.conf` for official WireGuard
7. Webhook emails the setup wizard URL (SpoSched Resend Edge Function)

## Secrets / env

Firebase App Hosting already holds Stripe + fulfillment secrets. Job runner reuses
`MINORWIRE_FULFILLMENT_SECRET` (or `MINORWIRE_DOWNLOAD_SECRET`) as
`x-minorwire-job-secret`. Firestore uses `GOOGLE_SERVICE_ACCOUNT_KEY` / ADC.
