# Create MinorWire Stripe catalog (products / prices / payment links).
# Usage:
#   .\scripts\create-minorwire-stripe-catalog.ps1 -Mode live
#   .\scripts\create-minorwire-stripe-catalog.ps1 -Mode test -ApiKey $env:STRIPE_SECRET_KEY_TEST
#
# Live uses PayNow. Test falls back to card if PayNow is unavailable on the account.

param(
  [ValidateSet('live', 'test')]
  [string]$Mode = 'test',
  [string]$ApiKey = '',
  [string]$RedirectBase = 'https://jittee.com'
)

$ErrorActionPreference = 'Stop'
$stripe = "C:\Users\Johji\AppData\Local\Microsoft\WinGet\Links\stripe.exe"
if (-not (Test-Path $stripe)) { $stripe = 'stripe' }

if (-not $ApiKey) {
  $keyFile = if ($Mode -eq 'live') { '.stripe_live_key' } else { '.stripe_test_key' }
  if (Test-Path $keyFile) { $ApiKey = (Get-Content $keyFile -Raw).Trim() }
}
if (-not $ApiKey) { throw "Provide -ApiKey or $keyFile" }

$liveFlag = @()
if ($Mode -eq 'live') { $liveFlag = @('--live') }

function Invoke-Stripe([string[]]$Args) {
  & $stripe @Args --api-key $ApiKey @liveFlag -c
}

$pm = if ($Mode -eq 'live') { 'paynow' } else { 'card' }

$appProd = Invoke-Stripe @(
  'products', 'create',
  '--name', $(if ($Mode -eq 'test') { 'MinorWire App (TEST)' } else { 'MinorWire App' }),
  '--description', 'Self-serve: IAM guide + provision tooling for WireGuard on Oracle Always Free',
  '-d', 'metadata[sku]=minorwire_app'
) | ConvertFrom-Json

$appPrice = Invoke-Stripe @(
  'prices', 'create',
  '--product', $appProd.id,
  '--unit-amount', '1800',
  '--currency', 'sgd',
  '--lookup-key', 'minorwire_app',
  '-d', 'metadata[sku]=minorwire_app'
) | ConvertFrom-Json

$setupProd = Invoke-Stripe @(
  'products', 'create',
  '--name', $(if ($Mode -eq 'test') { 'MinorWire Assisted Setup (TEST)' } else { 'MinorWire Assisted Setup' }),
  '--description', 'Assisted setup: IAM key creation, first VPN up, multiple device configs',
  '-d', 'metadata[sku]=minorwire_setup'
) | ConvertFrom-Json

$setupPrice = Invoke-Stripe @(
  'prices', 'create',
  '--product', $setupProd.id,
  '--unit-amount', '11800',
  '--currency', 'sgd',
  '--lookup-key', 'minorwire_setup',
  '-d', 'metadata[sku]=minorwire_setup'
) | ConvertFrom-Json

function New-PaymentLink($priceId, $sku) {
  $raw = Invoke-Stripe @(
    'payment_links', 'create',
    '-d', "line_items[0][price]=$priceId",
    '-d', 'line_items[0][quantity]=1',
    '-d', "payment_method_types[0]=$pm",
    '-d', 'after_completion[type]=redirect',
    '-d', "after_completion[redirect][url]=$RedirectBase/minorwire/thanks?session_id={CHECKOUT_SESSION_ID}",
    '-d', 'customer_creation=always',
    '-d', "metadata[sku]=$sku"
  ) 2>&1 | Out-String
  try { return $raw | ConvertFrom-Json } catch { throw $raw }
}

$appLink = New-PaymentLink $appPrice.id 'minorwire_app'
$setupLink = New-PaymentLink $setupPrice.id 'minorwire_setup'

$out = [ordered]@{
  mode = $Mode
  currency = 'sgd'
  payment_methods = @($pm)
  app = @{
    lookup_key = 'minorwire_app'
    product_id = $appProd.id
    price_id = $appPrice.id
    payment_link_id = $appLink.id
    url = $appLink.url
  }
  setup = @{
    lookup_key = 'minorwire_setup'
    product_id = $setupProd.id
    price_id = $setupPrice.id
    payment_link_id = $setupLink.id
    url = $setupLink.url
  }
}

$docPath = if ($Mode -eq 'live') {
  'D:\dancefloor\MinorWire\docs\STRIPE_LIVE.json'
} else {
  'D:\dancefloor\MinorWire\docs\STRIPE_TEST.json'
}
($out | ConvertTo-Json -Depth 6) | Set-Content $docPath -Encoding utf8
Write-Host "Wrote $docPath"
$out | ConvertTo-Json -Depth 6
