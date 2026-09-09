const OCI_REGION = 'ap-tokyo-1'

/** Direct Console deep links (Home Region Tokyo). Open while signed in. */
export const OCI_LINKS = {
  home: `https://cloud.oracle.com/?region=${OCI_REGION}`,
  tenancy: `https://cloud.oracle.com/tenancy?region=${OCI_REGION}`,
  compartments: `https://cloud.oracle.com/identity/compartments?region=${OCI_REGION}`,
  domains: `https://cloud.oracle.com/identity/domains?region=${OCI_REGION}`,
  myProfile: `https://cloud.oracle.com/identity/domains/my-profile?region=${OCI_REGION}`,
  policies: `https://cloud.oracle.com/identity/policies?region=${OCI_REGION}`,
} as const

export { OCI_REGION }
