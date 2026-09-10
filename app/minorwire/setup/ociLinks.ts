import { defaultRegionForLocale } from './regions'

const SIGNUP = 'https://signup.cloud.oracle.com/'
const SIGNUP_DOCS =
  'https://docs.oracle.com/en-us/iaas/Content/GSG/Tasks/signingup_topic-Sign_Up_for_Free_Oracle_Cloud_Promotion.htm'
const UPGRADE_DOCS =
  'https://docs.oracle.com/en-us/iaas/Content/Billing/Tasks/changingpaymentmethod.htm'

export type OciConsoleLinks = {
  signup: string
  signupDocs: string
  upgradeDocs: string
  home: string
  tenancy: string
  compartments: string
  domains: string
  myProfile: string
  /** My profile → Tokens and keys (API keys / auth tokens) */
  authTokens: string
  policies: string
  billingUpgrade: string
}

export type GuideOciLinkKey = keyof OciConsoleLinks

/** Console deep links for the selected OCI region. */
export function buildOciLinks(region: string): OciConsoleLinks {
  const r = region.trim() || defaultRegionForLocale('ja')
  return {
    signup: SIGNUP,
    signupDocs: SIGNUP_DOCS,
    upgradeDocs: UPGRADE_DOCS,
    home: `https://cloud.oracle.com/?region=${r}`,
    tenancy: `https://cloud.oracle.com/tenancy?region=${r}`,
    compartments: `https://cloud.oracle.com/identity/compartments?region=${r}`,
    domains: `https://cloud.oracle.com/identity/domains?region=${r}`,
    myProfile: `https://cloud.oracle.com/identity/domains/my-profile?region=${r}`,
    authTokens: `https://cloud.oracle.com/identity/domains/my-profile/auth-tokens?region=${r}`,
    policies: `https://cloud.oracle.com/identity/policies?region=${r}`,
    billingUpgrade: `https://cloud.oracle.com/billing/payment?region=${r}`,
  }
}

/** @deprecated Prefer buildOciLinks(region). Kept for static signup URLs in copy. */
export const OCI_LINKS = buildOciLinks(defaultRegionForLocale('ja'))

export { defaultRegionForLocale }
