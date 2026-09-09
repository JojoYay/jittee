import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MinorWire | Jittee',
  description:
    'Provision WireGuard on your Oracle Always Free tenancy in the browser. PayNow, paste a least-privilege OCI key, get a .conf for official WireGuard.',
}

export default function MinorWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
