import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MinorWire | Jittee',
  description:
    'Create your own private VPN on your cloud free tier. One-time setup, no monthly VPN fee. DIY or assisted by Jittee.',
}

export default function MinorWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
