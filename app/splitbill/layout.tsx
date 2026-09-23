import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Splitator — 立て替えた分、集めるところまで | Jittee',
  description:
    '飲み会やコートの予約で立て替えた分を、PayNowで集めるための無料ツール。登録不要・一人いくらかを自動計算・URLを配るだけ。お金はサイトを通りません。',
  openGraph: {
    title: 'Splitator — 立て替えた分、集めるところまで',
    description: '登録不要でPayNowの割り勘ページを作れます。一人いくらかを計算して、そのまま請求。',
    images: ['/splitbill/icon-512.png'],
  },
}

export default function SplitatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
