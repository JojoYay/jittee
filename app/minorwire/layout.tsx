import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MinorWire | Jittee',
  description:
    'Provision WireGuard on your Oracle Cloud Always Free tenancy and issue device configs from a small app.',
}

export default function MinorWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
