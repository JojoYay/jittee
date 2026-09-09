import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MinorWire | Jittee',
  description:
    'Provision WireGuard once on your Oracle Always Free tenancy. PayNow, paste a least-privilege OCI key, then mint as many device .conf files as you need for official WireGuard.',
}

export default function MinorWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
