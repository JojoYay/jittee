# MinorWire — Product brief (MVP)

Working name. Change freely before public launch.

## What we sell

A setup + management tool that provisions WireGuard on the **customer's** Oracle Cloud Always Free tenancy, then issues device configs (Windows / Android / iOS / macOS) from a small app.

We do **not** sell VPN bandwidth. Traffic runs on the customer's OCI instance.

## Stripe SKUs (one-time)

| SKU | Price | Includes |
|-----|-------|----------|
| `MinorWire_app` | SGD 18 | App license + self-serve guide (IAM policy snippet, OCID checklist, provision flow) |
| `MinorWire_setup` | SGD 118 | App + live assisted setup (screen share through IAM key creation, first VPN up, first device config) |
| `MinorWire_support` | SGD 100 | Add-on live support after DIY purchase |

Currency: **SGD**. Suggested upsell: buy app (S$18), then upgrade to assisted support for +S$100 (total S$118).

No monthly VPN fee in MVP. Optional later: support subscription.

## Customer inputs (app first-run)

- Region (e.g. `ap-tokyo-1`)
- Tenancy OCID
- Compartment OCID
- User OCID (dedicated least-privilege user)
- API key private key (PEM)

## Provisioned resources (target)

- Always Free shape: `VM.Standard.E2.1.Micro` when available
- Ubuntu LTS image
- VCN with public subnet + Internet Gateway (avoid paid NAT if possible)
- Security List / NSG: SSH + UDP 51820
- WireGuard (`wg0`) + `wg-add-peer`-equivalent API used by the app

## Flows

### Self-serve (S$18)

1. Pay Stripe → download app / unlock license
2. Customer creates IAM user + policy (copy-paste from in-app guide)
3. Paste OCI credentials into app
4. App runs provision + health check
5. App creates peers / QR / `.conf` per device

### Assisted (S$118)

Same outcome; Jittee walks steps 2–5 in one session (time-box in offer, e.g. 60 minutes, 2 devices).

## Non-goals (MVP)

- Hosting VPN on Jittee infrastructure
- Multi-tenant SaaS control plane beyond license check
- Guaranteeing Always Free capacity in every region
- iOS App Store distribution on day one (QR / Apple Configurator / TestFlight later OK)

## Compliance notes

- Least-privilege IAM only; never ask for full tenancy admin if avoidable
- Clear ToS: quality depends on customer's Always Free limits; stop/start from OCI console can change ephemeral public IP
- Customer owns the OCI bill and Free Tier eligibility

## Deliverable form (current)

Sales: jittee.com `/minorwire` → Stripe PayNow (SGD).  
Body: **Node.js CLI** (not a GUI installer yet) + IAM guide.  
Device VPN: official WireGuard apps via `.conf` / QR.  
Fulfillment MVP: email CLI package after payment (auto-download later).

## Repo plan (later)

- Windows/macOS GUI shell around the same provisioner
- Optional tiny license API + Stripe webhook (auto unlock)
- This site: marketing + checkout at `/minorwire`
