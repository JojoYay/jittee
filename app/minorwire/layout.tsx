import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MinorWire | Jittee',
  description:
    'Provision WireGuard on your Oracle Cloud Always Free tenancy. Buy the CLI toolkit via PayNow; connect with official WireGuard apps.',
}

export default function MinorWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
