'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { useLanguage } from '../contexts/LanguageContext'
import { useMinorWireStripeMode } from './StripeModeContext'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

const SUPPORT_MAIL = 'info@jittee.com'

/**
 * MinorWire marketing page.
 * Purchase surface avoids naming the underlying cloud / VPN stack brands.
 */

interface Copy {
  badge: string
  heroTitle: string
  heroDesc: string
  teaserTitle: string
  teaserBody: string
  freeOpsTitle: string
  freeOpsBody: string
  ctaApp: string
  ctaSetup: string
  ctaNote: string
  conceptTitle: string
  conceptDesc: string
  deliveryTitle: string
  deliveryLead: string
  deliveryCloud: string
  deliveryCloudWho: string
  deliveryServer: string
  deliveryServerWho: string
  deliveryGuide: string
  deliveryTogether: string
  compareTitle: string
  compareIntro: string
  compareThesis: string
  compareColSelf: string
  compareColCommercial: string
  compareRows: { label: string; self: string; commercial: string }[]
  compareStrengthsTitle: string
  compareStrengths: string[]
  compareWhenTitle: string
  compareWhenSelf: string
  compareWhenCommercial: string
  compareWhenBoth: string
  compareLatencyNote: string
  verifiedTitle: string
  verifiedIntro: string
  verifiedReputation: string
  verifiedWhy: string
  verifiedRows: { service: string; note: string }[]
  verifiedCaveatsTitle: string
  verifiedCaveats: string[]
  howTitle: string
  steps: { title: string; desc: string }[]
  chooseTitle: string
  chooseIntro: string
  pricingTitle: string
  planAppName: string
  planAppPrice: string
  planAppListPrice: string
  planAppPromo: string
  planAppDesc: string
  planAppPoints: string[]
  planAppBest: string
  planSetupName: string
  planSetupPrice: string
  planSetupDesc: string
  planSetupPoints: string[]
  planSetupBest: string
  needTitle: string
  needPoints: string[]
  needLead: string
  faqTitle: string
  faqs: { q: string; a: string }[]
  finalTitle: string
  finalDesc: string
  paidAppTitle: string
  paidAppBody: string
  paidSetupTitle: string
  paidSetupBody: string
  paidMailCta: string
}

const COPY: Record<string, Copy> = {
  ja: {
    badge: '自分のクラウドで動く、自分の VPN',
    heroTitle: '一度つくれば、毎月の運用費は基本ゼロのVPN',
    heroDesc:
      'あなたが用意するクラウド上に、専用の VPN サーバーを1台自動で立てます。キーを登録するだけで完了。回線もサーバーもあなたのものなので、有名な月額 VPN サービスのような毎月課金はありません。',
    teaserTitle: 'VPNサーバーを立ててテレビを見よう',
    teaserBody:
      '海外にいても、選んだ国からアクセスしているように見せるためのシンプルな VPN サーバーです。セットアップは約5分で完了します。',
    freeOpsTitle: '毎月の運用費用は無料',
    freeOpsBody:
      'クラウド側の無料枠の範囲で動かすので、サーバー代・VPN 利用料としての月額はかかりません。かかるのは最初のセットアップ料金（買い切り）だけです。',
    ctaApp: '自分で設定 S$18（開始記念・定価 S$30）',
    ctaSetup: 'DIY + サポート S$118（PayNow）',
    ctaNote: '決済は Stripe PayNow。支払い後にセットアップ画面へ進みます（メールでも URL を送付）。',
    conceptTitle: 'VPNサーバーの真実',
    conceptDesc:
      'VPN は特別なサービスではありません。サーバーを自分で立てるのに、高度な専門知識は不要です。いまはクラウド上にサーバーを置けば、元手ゼロで VPN サーバーを作れます。有名ブランドほど「既知の VPN」として弾かれやすい — その逆を行くのが、次世代の VPN です。',
    deliveryTitle: 'VPN提供するための構成',
    deliveryLead:
      'あなたがクラウドを契約します。その契約したクラウド上に VPN サーバーを立てます。クラウドは無料運用が可能なものをこちらから指定するので、実質運用にかかるコストはありません。',
    deliveryCloud: 'クラウド',
    deliveryCloudWho: 'お客様がサインアップして準備',
    deliveryServer: 'VPN サーバー',
    deliveryServerWho: 'Jittee が用意・起動',
    deliveryGuide: 'やり方がわからない場合でも大丈夫。画面の手順は Jittee が説明します。',
    deliveryTogether: 'それでも不安なときは、一緒に設定するオプションもあります。',
    compareTitle: '大手 VPN 業者（NordVPN / ExpressVPN など）との違い',
    compareIntro:
      'どちらも「VPN」と呼ばれますが、道具としては別物です。絶対的な匿名を競う話ではなく、「VPN だから」と弾かれにくいかどうかが分かれ目です。',
    compareThesis:
      '有名なほどリストに載る。あなた1人の薄い出口は、そうは見えない。次世代の VPN — それが MinorWire。',
    compareColSelf: '自前（MinorWire / 自分のクラウド）',
    compareColCommercial: '大手 VPN（NordVPN 等）',
    compareRows: [
      {
        label: '出口 IP',
        self: '専用・固定に近い。あなた専用の1本（Minor）',
        commercial: '多数の利用者で共有される出口',
      },
      {
        label: 'IP レピュテーション',
        self: '測定例: Anonymizing VPN = No — 典型的な判定では「既知の VPN」と扱われにくい → 「VPN だから」で弾かれにくい',
        commercial: '有名なほどブロックリストに載りやすい',
      },
      {
        label: '出口の場所',
        self: '選んだクラウド地域に1か所',
        commercial: '多数の国・都市から選べる',
      },
      {
        label: 'ログ',
        self: 'サーバーは自分管理。残す／残さないも自分次第',
        commercial: 'ノーログ方針は業者のポリシー。重大な不正・犯罪では開示に応じる',
      },
      {
        label: '法的・不正利用',
        self: '悪用通報はテナント名義のあなたに届く。クラウドは法令に基づく開示請求に応じうる',
        commercial: '業者側が受け皿になることが多いが、重大事案では開示される',
      },
      {
        label: '匿名性',
        self: '絶対的な匿名は売りません。出口だけでは第三者に身元が分かりにくいことが多いが、群衆に紛れるモデルではない',
        commercial: '群衆に紛れるのが売り。それでも犯罪の盾にはならない',
      },
      {
        label: 'ストリーミング／地理制限',
        self: '「既知 VPN」リスト回避が効くことがある。ページ到達の例はあるが、再生ブロックは後から起きうる（保証なし）',
        commercial: '共有 IP はリストに載りやすい。出口を回し、配信向けに最適化していることが多い',
      },
      {
        label: '帯域・同時利用',
        self: '無料枠インスタンス相当。ライト利用向け',
        commercial: 'プラン内で広めの帯域・多端末向き',
      },
      {
        label: '料金',
        self: '買い切りツール代＋クラウド無料枠（条件次第）',
        commercial: '月額／年額のサブスク',
      },
      {
        label: 'その他',
        self: 'DNS・スプリットトンネルなど構成を自分で決められる',
        commercial: 'アプリ・キルスイッチ・多機能 UI が揃っている',
      },
    ],
    compareStrengthsTitle: '自前ホストだけができること',
    compareStrengths: [
      'レピュテーション上「匿名化 VPN」と見なされにくいことがある — 「VPN だから」で弾かれにくい出口',
      '固定の出口 IP を、自宅・会社の許可リストに登録できる',
      '自分の端末どうしを、インターネットを経由しない私有 LAN のように結べる',
      'DNS やスプリットトンネルまで、構成を自分で完全にコントロールできる',
      'ISP や同じ Wi‑Fi 上の他人からは通信先を隠しやすい（訪問先サイトからは、出口 IP は見える）',
    ],
    compareWhenTitle: 'どちらを使うか',
    compareWhenSelf:
      '日常の出口として「VPN 扱い」を避けたい、許可リスト用の固定 IP、公共 Wi‑Fi 対策、端末同士の接続 — 自前向き。犯罪のための群衆匿名は求めていません。',
    compareWhenCommercial:
      '多国の出口や、配信向けに出口を回したい用途 — 大手 VPN 向き。有名なほどリストに載りやすいトレードオフがあります。',
    compareWhenBoth: '用途が違うので、両方使う人も少なくありません。',
    compareLatencyNote:
      '出口が自分から遠いクラウド地域だと、往復遅延（RTT）が増えます。必要な用途に絞って使うのがおすすめです。',
    verifiedTitle: '動作確認済みサービス（2026-09-11 時点）',
    verifiedIntro:
      'お客様の OCI Always Free 上の WireGuard 出口での一例です（特定 IP を全員が得るわけではありません）。ページ到達・カタログ表示中心。ログイン後の再生や追加認証までは未確認の項目があります。',
    verifiedReputation:
      'Scamalytics（2026-09-11 測定の一例・永続保証なし）: Fraud Score 5/100 Low Risk。Datacenter Yes / Server Yes は想定どおり。決定打は Anonymizing VPN = No — レピュテーション上「VPN」として未登録。だから「VPN だから」で弾かれにくい。主要ブロックリストもクリア。',
    verifiedWhy:
      'MinorWire の「Minor」は、あなた1人の薄い出口のこと。お客様が欲しいのは犯罪用の匿名ではなく、日常で使える出口です。有名 VPN ほどリストに積み上がりブロックされやすい。MinorWire はその逆 — 絶対的な匿名ではない（クラウドは法令開示に応じうる）が、出口だけでは第三者が誰かを知るのは通常難しい。それが次世代の VPN です。',
    verifiedRows: [
      {
        service: 'Netflix JP',
        note: 'JP ページ / ¥890 / JP カタログ表示まで。再生は未確認（ログイン再生時に M7111-5059 等が起きうる）',
      },
      {
        service: 'Disney+ JP',
        note: 'JP TOP 10・ドコモ提携 UI の表示まで確認',
      },
      {
        service: 'Google 検索',
        note: 'CAPTCHA なし。AI Overview も表示',
      },
      {
        service: 'ChatGPT',
        note: 'Cloudflare チャレンジなし',
      },
      {
        service: 'DBS iBanking',
        note: 'ログイン画面到達まで（ログイン後の追加認証は未確認）',
      },
      {
        service: 'SBI 証券',
        note: 'リアルタイム気配付きのフル UI まで。それ以降の認証は未確認',
      },
    ],
    verifiedCaveatsTitle: '注意（短く）',
    verifiedCaveats: [
      'Fraud Score や VPN 判定は測定時点の一例。永続保証ではありません',
      'Netflix の再生は未確認です',
      '評価はあなたのトラフィック次第。悪用・ノイズが多いと自分の IP が傷つく',
      'クラウド事業者のアドレス帯が後から一括リスト入りすることがある（制御外）',
      'サービス側の再スキャンで、半年後には結果が変わりうる',
      '金融はログイン画面までの確認。ログイン後の追加認証は未検証 — 実運用で判断してください',
    ],
    howTitle: '流れ',
    steps: [
      {
        title: 'クラウド口座を用意',
        desc: '無料枠が使えるクラウドアカウントを作り、VPN を置きたい地域を選びます。',
      },
      {
        title: 'キーを登録するだけ',
        desc: '管理者用の API キーをセットアップ画面に貼ると、専用 VPN サーバーを自動作成します。',
      },
      {
        title: '端末につなぐ',
        desc: '表示された接続設定をスマホや PC の VPN アプリに入れます。追加端末も同じ画面から作れます。',
      },
    ],
    chooseTitle: 'どっちがよいですか？',
    chooseIntro:
      '手順はかなり簡単なので、案内に沿って自分で設定できます。時間を節約したい・一緒に確認しながら進めたい場合は、Jittee に設定を依頼（有料）も選べます。',
    pricingTitle: '料金（買い切り・SGD）',
    planAppName: '自分で設定',
    planAppPrice: 'S$18',
    planAppListPrice: 'S$30',
    planAppPromo: 'サービス開始記念価格（定価 S$30）',
    planAppDesc: 'インストラクションに沿って自分でキー登録〜起動まで進める方向け。',
    planAppPoints: [
      '画面の手順どおりに進めれば完了',
      'キー登録だけでサーバー自動作成',
      '購入ごとにサーバー構築は1回',
      '端末の接続設定は追加発行可',
    ],
    planAppBest: '自分で触るのが苦にならない人向け',
    planSetupName: 'DIY + サポート',
    planSetupPrice: 'S$118',
    planSetupDesc:
      '自分で設定（S$18）とライブサポート（S$100）の2商品セット。ウィザード＋ WhatsApp 画面共有で一緒に完了します。',
    planSetupPoints: [
      'DIY 機能（サーバー自動作成）を含む',
      'ライブサポート（目安60分）',
      'VPN 起動まで確認',
      '複数端末の設定も一緒に',
    ],
    planSetupBest: '最初から一緒に進めたい人向け',
    needTitle: '必要なもの',
    needPoints: ['メールアドレス', 'クレジットカード'],
    needLead:
      '上記を用意し、Jittee が指定するクラウドをそのメールとカードで契約します。契約したクラウド上に、あなたのプライベート VPN サーバーを構築します（ツール代は PayNow）。',
    faqTitle: 'FAQ',
    faqs: [
      {
        q: '毎月の VPN 料金はありますか？',
        a: 'ありません。無料枠の範囲で動かせば、運用の月額は基本ゼロです。Stripe で払うのは最初のツール代（と希望者向けの設定代行）だけです。',
      },
      {
        q: 'クラウドの運用ができるか不安です',
        a: '無料枠のまま運用できるクラウドを選定しているので、つけっぱなしで問題ありません。やめたいときはクラウドアカウントごと解約すれば追加料金もなく、即日でやめられます。',
      },
      {
        q: 'NordVPN などと何が違いますか？',
        a: '根本的に別の道具です。有名 VPN ほどブロックリストに載り、「VPN だから」と弾かれやすい。MinorWire はその逆 — あなた1人の薄い出口で、測定例では Anonymizing VPN = No（永続保証なし）。お客様が欲しいのは犯罪用の群衆匿名ではなく、日常の出口です。絶対的な匿名は売りません（クラウドは法令開示に応じうる）。大手もノーログを掲げても重大事案では開示します。許可リスト用の固定 IP や端末同士の接続は自前向きです。詳細は上の比較表と確認結果を参照してください。',
      },
      {
        q: '匿名になれますか？',
        a: '絶対的な匿名は製品の目的ではありません。クラウド事業者は法令に基づく開示請求に応じうるし、悪用通報はテナント名義のあなたに届きます。一方、出口 IP だけでは第三者が誰かを知るのは通常難しいです。犯罪のための群衆匿名が必要なら、この製品の対象外です。',
      },
      {
        q: 'API キーは保存されますか？',
        a: 'はい。登録したクラウド API キーは、サーバー再作成のために暗号化して保管します（ブラウザの入力欄は送信後に残しません）。鍵の管理はお客様の責任です。誤って削除した API キーでは再作成できず、その場合 Jittee は責任を負いません。端末追加用にインスタンス接続鍵も暗号化して保持します。',
      },
      {
        q: 'インスタンスを Stop / Terminate したらどうなりますか？',
        a: 'OCI コンソールでインスタンスを Stop または Terminate すると、VPN サーバーへ接続できなくなります。誤って削除した場合、再作成は初回登録の API キーが有効なときだけ可能です。',
      },
      {
        q: '何台までつながりますか？',
        a: '購入1回あたりサーバー構築は1回です（登録キーによる再作成は可）。端末ごとの接続設定は何度でも追加できます。同時利用の現実目安は数台〜十台前後のライト利用です。',
      },
    ],
    finalTitle: 'まず、自分でやるか・任せるかを選んでください。',
    finalDesc: 'どちらも支払い後すぐにセットアップ画面へ進めます。迷ったらサポート付きが確実です。',
    paidAppTitle: 'お支払いありがとうございます（自分で設定）',
    paidAppBody: 'セットアップ画面へ進んでください。メールにも同じ URL を送っています。',
    paidSetupTitle: 'お支払いありがとうございます（設定代行）',
    paidSetupBody: 'ウィザードで進めつつ、日程は info@jittee.com までご連絡ください。',
    paidMailCta: 'メールで連絡する',
  },
  en: {
    badge: 'Your cloud. Your private VPN.',
    heroTitle: 'A VPN you set up once — monthly ops stay near zero.',
    heroDesc:
      'We automatically create one dedicated VPN server on the cloud account you provide. Just register an admin API key. Because the server and pipe are yours, there is no recurring fee like popular monthly VPN brands.',
    teaserTitle: 'Spin up a VPN server. Watch TV like you\'re home.',
    teaserBody:
      'A simple VPN server so that while you are overseas, it looks like you are accessing from a country you choose. Setup finishes in about five minutes.',
    freeOpsTitle: 'Monthly operating cost: free',
    freeOpsBody:
      'Because it runs within the cloud free allowance, there is no monthly server fee or VPN usage fee. You only pay the one-time setup charge.',
    ctaApp: 'Do it yourself S$18 (launch price; list S$30)',
    ctaSetup: 'DIY + support S$118 (PayNow)',
    ctaNote: 'Stripe PayNow. After payment you open the setup wizard (URL also emailed).',
    conceptTitle: 'The truth about VPN servers',
    conceptDesc:
      'A VPN is not a special service. You do not need deep expertise to run a server, and on today’s clouds you can create a VPN server with essentially no capital outlay. The more famous the brand, the more often it is blocked as a “known VPN.” The opposite of that — a next-generation VPN.',
    deliveryTitle: 'How we provide the VPN',
    deliveryLead:
      'You sign up for the cloud. We place a VPN server on that account. We point you to a cloud that can run within a free allowance, so ongoing operating cost is effectively zero.',
    deliveryCloud: 'Cloud',
    deliveryCloudWho: 'You sign up and prepare it',
    deliveryServer: 'VPN server',
    deliveryServerWho: 'Jittee provisions and starts it',
    deliveryGuide: 'If the steps feel unfamiliar, Jittee explains the process on screen.',
    deliveryTogether: 'Still unsure? There is an option to set it up together with Jittee.',
    compareTitle: 'Vs. major VPN vendors (NordVPN / ExpressVPN and similar)',
    compareIntro:
      'Both are called “VPNs,” but they are different tools. This is not a race for absolute anonymity — the split is whether you get blocked for “being a VPN.”',
    compareThesis:
      'The more famous the VPN, the more it lands on blocklists. A light exit used by you alone often does not. That next-generation VPN is MinorWire.',
    compareColSelf: 'Self-hosted (MinorWire / your cloud)',
    compareColCommercial: 'Major VPN (NordVPN etc.)',
    compareRows: [
      {
        label: 'Exit IP',
        self: 'Dedicated / near-fixed — yours alone (Minor)',
        commercial: 'Shared exits used by many customers',
      },
      {
        label: 'IP reputation',
        self: 'Example: Anonymizing VPN = No — typical systems do not treat it as a known VPN → less likely blocked for “being a VPN”',
        commercial: 'The more famous, the more often it lands on blocklists',
      },
      {
        label: 'Exit locations',
        self: 'One place: the cloud region you choose',
        commercial: 'Many countries and cities to pick from',
      },
      {
        label: 'Logs',
        self: 'You run the server; what you keep is up to you',
        commercial: 'No-logs is the provider’s policy; serious abuse or crime still leads to disclosure',
      },
      {
        label: 'Legal / abuse',
        self: 'Abuse reports go to you as the tenancy owner. Your cloud can disclose under a lawful request',
        commercial: 'Provider often takes first contact — and discloses for serious cases',
      },
      {
        label: 'Anonymity',
        self: 'Not anonymity theater. Third parties usually cannot tell who you are from the exit alone — but you do not blend into a crowd',
        commercial: 'Crowd anonymity is the pitch. It is still not a crime shield',
      },
      {
        label: 'Streaming / geo-unblock',
        self: 'Avoiding “known VPN” lists can help. Catalog pages sometimes load; playback blocks can still appear later (no guarantee)',
        commercial: 'Shared IPs often land on VPN lists. Rotating exits, often tuned for streaming',
      },
      {
        label: 'Bandwidth / concurrent use',
        self: 'Free-tier instance class — light personal use',
        commercial: 'Broader bandwidth and multi-device plans',
      },
      {
        label: 'Price',
        self: 'One-time tool fee + cloud free allowance (policy permitting)',
        commercial: 'Monthly or yearly subscription',
      },
      {
        label: 'Extras',
        self: 'Full control of DNS, split tunnel, and layout',
        commercial: 'Polished apps, kill switch, feature-rich UI',
      },
    ],
    compareStrengthsTitle: 'What only self-hosting can do well',
    compareStrengths: [
      'May stay off “anonymizing VPN” reputation flags — an exit less likely blocked for “being a VPN”',
      'A stable exit IP you can put on home or office allowlists',
      'A private LAN-style path between your own devices',
      'Full control of DNS, split tunneling, and how traffic is routed',
      'Hides destinations from your ISP or others on the same Wi‑Fi — not from the sites you visit (they still see the exit IP)',
    ],
    compareWhenTitle: 'When to use which',
    compareWhenSelf:
      'An everyday exit that avoids “VPN treatment,” a fixed IP for allowlists, public Wi‑Fi protection, linking your own devices — prefer self-hosted. You are not shopping for crowd anonymity for crime.',
    compareWhenCommercial:
      'Many country exits or rotating exits tuned for streaming — prefer a major commercial VPN. Fame is the tradeoff: the more famous, the more it gets listed.',
    compareWhenBoth: 'They solve different jobs; many people use both.',
    compareLatencyNote:
      'If the exit sits in a distant cloud region, round-trip time (RTT) rises. Use it for focused purposes rather than everything.',
    verifiedTitle: 'Services checked (as of 2026-09-11)',
    verifiedIntro:
      'One example on a customer OCI Always Free WireGuard exit (not every customer gets the same IP). Focus is page / catalog reach; logged-in playback or step-up auth is not claimed where noted.',
    verifiedReputation:
      'Scamalytics (one measurement on 2026-09-11 — not a forever guarantee): Fraud Score 5/100 Low Risk. Datacenter Yes / Server Yes is expected. The decisive flag is Anonymizing VPN = No — not registered as a VPN on reputation lists, so less likely blocked for “being a VPN.” Major public blocklists also clear.',
    verifiedWhy:
      '“Minor” in MinorWire means a light exit used by you alone. Customers want a usable everyday exit — not anonymity for crime. Famous VPNs pile onto blocklists; MinorWire is the opposite. Absolute anonymity is not the product (your cloud can disclose under a lawful request), yet third parties usually cannot tell who you are from the exit alone. That next-generation VPN is MinorWire.',
    verifiedRows: [
      {
        service: 'Netflix JP',
        note: 'JP page / ¥890 / JP catalog. Playback not verified (logged-in play may hit M7111-5059 etc.)',
      },
      {
        service: 'Disney+ JP',
        note: 'JP TOP 10 and docomo partnership UI shown',
      },
      {
        service: 'Google Search',
        note: 'No CAPTCHA; AI Overview OK',
      },
      {
        service: 'ChatGPT',
        note: 'No Cloudflare challenge',
      },
      {
        service: 'DBS iBanking',
        note: 'Reached login screen only (post-login step-up not verified)',
      },
      {
        service: 'SBI Securities',
        note: 'Full UI with live quotes; further auth not claimed',
      },
    ],
    verifiedCaveatsTitle: 'Caveats (brief)',
    verifiedCaveats: [
      'Fraud Score and VPN flags are a point-in-time example — not permanent',
      'Netflix playback is still unverified',
      'Reputation depends on your own traffic; noisy abuse burns your IP',
      'Cloud address ranges may later be bulk-listed (out of your control)',
      'Services may re-scan; results can differ half a year later',
      'Finance: login screen OK in the test; post-login step-up auth not verified — judge in practice',
    ],
    howTitle: 'How it works',
    steps: [
      {
        title: 'Prepare a cloud account',
        desc: 'Create a free-tier-capable cloud account in the region where you want the VPN.',
      },
      {
        title: 'Register a key',
        desc: 'Paste an admin API key into the setup screen — we create the dedicated VPN server automatically.',
      },
      {
        title: 'Connect devices',
        desc: 'Import the connection profile into a free official VPN client on phone or PC. Add more devices anytime.',
      },
    ],
    chooseTitle: 'Which option is better for you?',
    chooseIntro:
      'Setup is simple enough to follow the on-screen instructions yourself. If you prefer speed and a guided session, pay Jittee to configure it with you.',
    pricingTitle: 'Pricing (one-time, SGD)',
    planAppName: 'Do it yourself',
    planAppPrice: 'S$18',
    planAppListPrice: 'S$30',
    planAppPromo: 'Launch commemorative price (list S$30)',
    planAppDesc: 'Follow the instructions and finish key registration through first connect on your own.',
    planAppPoints: [
      'Step-by-step on-screen guide',
      'Key registration creates the server automatically',
      'One server provision per purchase',
      'Extra device profiles anytime',
    ],
    planAppBest: 'Best if you are fine clicking through a short guide',
    planSetupName: 'DIY + support',
    planSetupPrice: 'S$118',
    planSetupDesc:
      'Bundle of DIY (S$18) and live support (S$100). Wizard access plus WhatsApp screen-share.',
    planSetupPoints: [
      'Includes DIY server provisioning',
      'Live help (~60 min)',
      'Confirm VPN is up',
      'Add multiple device profiles together',
    ],
    planSetupBest: 'Best if you want help from the start',
    needTitle: 'What you need',
    needPoints: ['Email address', 'Credit card'],
    needLead:
      'With that email and credit card you sign up for the cloud Jittee specifies. We then build your private VPN server on that contracted cloud (tool fee via PayNow).',
    faqTitle: 'FAQ',
    faqs: [
      {
        q: 'Is there a monthly VPN fee?',
        a: 'No. Within the free cloud allowance, monthly ops are basically free. Stripe only charges the one-time tool fee (and optional assisted setup).',
      },
      {
        q: 'I am worried about operating the cloud myself.',
        a: 'We pick a cloud that can run within a free allowance, so leaving it on is fine. When you want to stop, cancel the cloud account entirely — no extra fees, and you can close it the same day.',
      },
      {
        q: 'How is this different from NordVPN and similar?',
        a: 'They are fundamentally different tools. Famous VPNs land on blocklists and get rejected for “being a VPN.” MinorWire is the opposite — a light exit used by you alone; in one measurement, Anonymizing VPN = No (not a forever guarantee). Customers want an everyday exit, not crowd anonymity for crime. Absolute anonymity is not the product (your cloud can disclose under a lawful request). Big VPNs advertise no-logs and still disclose for serious cases. Allowlisted fixed IPs and private device links favor self-hosted. See the comparison table and checked-services section above.',
      },
      {
        q: 'Will this make me anonymous?',
        a: 'Absolute anonymity is not the goal. Your cloud can disclose under a lawful request, and abuse reports go to you as the tenancy owner. Otherwise, third parties usually cannot tell who you are from the exit alone. If you need crowd anonymity for crime, this product is not for you.',
      },
      {
        q: 'Do you store my API key?',
        a: 'Yes. The cloud API key you register is stored encrypted so we can recreate the server later (form fields are cleared in the browser after submit). You must keep that key secure. If you delete the API key, recreation is impossible and Jittee accepts no liability. An encrypted instance SSH key is also kept so you can add device profiles.',
      },
      {
        q: 'What if I Stop or Terminate the instance?',
        a: 'If you Stop or Terminate the instance in the OCI console, the VPN server becomes unreachable. If you delete it by mistake, recreation is possible only with the currently registered API key from first setup.',
      },
      {
        q: 'How many devices can connect?',
        a: 'One server provision per purchase (recreate with the registered key is allowed). Device profiles can be added anytime. Concurrent light use is realistically a handful to about ten devices.',
      },
    ],
    finalTitle: 'Pick DIY or assisted — then start.',
    finalDesc: 'Either path opens the setup wizard right after PayNow. If unsure, assisted is the safer choice.',
    paidAppTitle: 'Thanks for your payment (DIY)',
    paidAppBody: 'Continue to the setup wizard. The same URL is emailed.',
    paidSetupTitle: 'Thanks for your payment (assisted)',
    paidSetupBody: 'Use the wizard, and email info@jittee.com to schedule screen-share.',
    paidMailCta: 'Email us',
  },
  zh: {
    badge: '跑在你自己云上的专属 VPN',
    heroTitle: '设置一次，之后月费基本为零的 VPN',
    heroDesc:
      '我们在你准备的云账号上自动创建一台专属 VPN 服务器。只需登记管理员 API 密钥。服务器与线路归你，因此不像常见月付 VPN 品牌那样每月收费。',
    teaserTitle: '搭一台 VPN 服务器，像在家一样看电视',
    teaserBody:
      '这是一台简单的 VPN 服务器，让你在海外时看起来像从选定的国家访问。大约 5 分钟即可完成设置。',
    freeOpsTitle: '每月运营费用：免费',
    freeOpsBody:
      '因为在云免费额度内运行，没有按月的服务器费或 VPN 使用费。你只需支付一次性的设置费用。',
    ctaApp: '自己设置 S$18（上线纪念价 · 定价 S$30）',
    ctaSetup: 'DIY + 支持 S$118（PayNow）',
    ctaNote: 'Stripe PayNow。付款后进入设置向导（邮件也会发送链接）。',
    conceptTitle: 'VPN 服务器的真相',
    conceptDesc:
      'VPN 并不是什么特别的服务。自己搭服务器并不需要高深专业知识；如今在云上开一台服务器，几乎不用启动资金就能做出 VPN 服务器。品牌越有名，越容易被当成「已知 VPN」拦截 — 走相反方向的，才是下一代 VPN。',
    deliveryTitle: '我们如何提供 VPN',
    deliveryLead:
      '由你签约云服务。我们在该账号上搭建 VPN 服务器。云我们指定可免费运营的方案，因此实质运营成本接近于零。',
    deliveryCloud: '云',
    deliveryCloudWho: '由你注册并准备',
    deliveryServer: 'VPN 服务器',
    deliveryServerWho: '由 Jittee 准备并启动',
    deliveryGuide: '即使不熟悉流程也没关系，Jittee 会在页面上说明怎么做。',
    deliveryTogether: '仍不确定时，也可以选择与 Jittee 一起完成设置。',
    compareTitle: '与大型 VPN 商家（NordVPN / ExpressVPN 等）的区别',
    compareIntro:
      '虽然都叫「VPN」，但其实是不同的工具。重点不是绝对匿名的竞赛，而是会不会因为「看起来像 VPN」而被拦截。',
    compareThesis:
      '越有名，越容易进名单。只属于你的轻量出口，往往不会。下一代 VPN — 就是 MinorWire。',
    compareColSelf: '自建（MinorWire / 你自己的云）',
    compareColCommercial: '大型 VPN（NordVPN 等）',
    compareRows: [
      {
        label: '出口 IP',
        self: '专用、接近固定，只属于你（Minor）',
        commercial: '大量用户共享出口',
      },
      {
        label: 'IP 信誉',
        self: '测量例：Anonymizing VPN = No — 典型系统不把它当「已知 VPN」→ 更不易因「是 VPN」被拦',
        commercial: '越有名，越容易进封锁名单',
      },
      {
        label: '出口位置',
        self: '你所选的一个云区域',
        commercial: '可选多个国家与城市',
      },
      {
        label: '日志',
        self: '服务器由你管理，是否留存由你决定',
        commercial: '无日志是商家政策；严重滥用或犯罪仍会披露',
      },
      {
        label: '法律 / 滥用',
        self: '滥用投诉会发到租户名义的你。云厂商可依法令请求披露',
        commercial: '通常由商家先承接 — 重大案件仍会披露',
      },
      {
        label: '匿名性',
        self: '不是匿名表演。仅凭出口，第三方通常难以认出你是谁 — 但你不会融入人群',
        commercial: '人群匿名是卖点。仍不是犯罪的盾牌',
      },
      {
        label: '流媒体 / 地理限制',
        self: '避开「已知 VPN」名单有时有效。目录页可能能打开，但播放拦截仍可能随后出现（无保证）',
        commercial: '共享 IP 容易进入 VPN 名单；会轮换出口，并常针对流媒体优化',
      },
      {
        label: '带宽 / 并发',
        self: '免费额度实例级别，适合轻度使用',
        commercial: '套餐内带宽更宽、更适合多设备',
      },
      {
        label: '价格',
        self: '一次性工具费 + 云免费额度（视政策而定）',
        commercial: '月付或年付订阅',
      },
      {
        label: '其他',
        self: 'DNS、分流等可完全自行决定',
        commercial: '应用、Kill Switch、功能丰富的界面',
      },
    ],
    compareStrengthsTitle: '只有自建才擅长的事',
    compareStrengths: [
      '有时信誉上不标为「匿名化 VPN」— 更不易因「是 VPN」被拦的出口',
      '固定出口 IP，可加入家庭或公司的允许列表',
      '在你自己的设备之间建立类似私有局域网的连接',
      'DNS、分流等路由方式由你完全掌控',
      '可对 ISP 或同一 Wi‑Fi 上的他人隐藏目的地（访问的网站仍能看到出口 IP）',
    ],
    compareWhenTitle: '该用哪一种',
    compareWhenSelf:
      '想要日常出口、少被当成「VPN」对待、允许列表固定 IP、公共 Wi‑Fi 防护、连接自己的设备 — 更适合自建。你要的不是犯罪用的人群匿名。',
    compareWhenCommercial:
      '需要多国出口或为流媒体轮换出口 — 更适合大型商业 VPN。有名是代价：越有名越容易进名单。',
    compareWhenBoth: '用途不同，不少人两者都会用。',
    compareLatencyNote:
      '若出口落在较远的云区域，往返延迟（RTT）会增加。建议按需要的用途来用，而不是什么都走它。',
    verifiedTitle: '已验证服务（截至 2026-09-11）',
    verifiedIntro:
      '以客户 OCI Always Free 上的 WireGuard 出口实测为例（并非每位客户都会分到同一 IP）。以页面 / 目录可达为主；注明处不含登录后播放或二次认证。',
    verifiedReputation:
      'Scamalytics（2026-09-11 一次测量示例 · 非永久保证）：Fraud Score 5/100 Low Risk。Datacenter Yes / Server Yes 属预期。决定性标志是 Anonymizing VPN = No — 信誉名单上未登记为 VPN，因此更不易因「是 VPN」被拦。主要公开封锁名单亦清空。',
    verifiedWhy:
      'MinorWire 的「Minor」指只属于你的轻量出口。客户要的是日常可用的出口，不是犯罪用的匿名。有名 VPN 更容易堆进名单被拦；MinorWire 走相反方向。绝对匿名不是产品目标（云厂商可依法令披露），但仅凭出口，第三方通常难以认出你是谁。这就是下一代 VPN。',
    verifiedRows: [
      {
        service: 'Netflix JP',
        note: 'JP 页面 / ¥890 / JP 目录展示。播放未验证（登录播放可能出现 M7111-5059 等）',
      },
      {
        service: 'Disney+ JP',
        note: '已显示 JP TOP 10 与 docomo 合作界面',
      },
      {
        service: 'Google 搜索',
        note: '无 CAPTCHA；AI Overview 正常',
      },
      {
        service: 'ChatGPT',
        note: '无 Cloudflare 挑战',
      },
      {
        service: 'DBS iBanking',
        note: '仅到达登录页（登录后二次认证未验证）',
      },
      {
        service: 'SBI 证券',
        note: '含实时报价的完整 UI；再往后的认证不作声明',
      },
    ],
    verifiedCaveatsTitle: '注意（简要）',
    verifiedCaveats: [
      'Fraud Score 与 VPN 判定仅为当时一例，非永久保证',
      'Netflix 播放仍未验证',
      '信誉取决于你自己的流量；滥用或噪声会毁掉你的 IP',
      '云厂商地址段日后可能被批量列入名单（无法控制）',
      '服务方可能重新扫描；半年后结果可能不同',
      '金融：测试仅确认登录页；登录后二次认证未验证 — 请按实际使用自行判断',
    ],
    howTitle: '流程',
    steps: [
      {
        title: '准备云账号',
        desc: '创建可用免费额度的云账号，并选择你想放置 VPN 的区域。',
      },
      {
        title: '登记密钥即可',
        desc: '在设置页粘贴管理员 API 密钥，我们会自动创建专属 VPN 服务器。',
      },
      {
        title: '连接设备',
        desc: '把连接配置导入手机或电脑的免费官方 VPN 客户端。可随时追加设备。',
      },
    ],
    chooseTitle: '该选哪一种？',
    chooseIntro:
      '流程很简单，可以按说明自己完成。若想省时间、希望有人一起确认，也可以付费请 Jittee 代为设置。',
    pricingTitle: '价格（一次性 · SGD）',
    planAppName: '自己设置',
    planAppPrice: 'S$18',
    planAppListPrice: 'S$30',
    planAppPromo: '服务上线纪念价（定价 S$30）',
    planAppDesc: '按说明自行完成密钥登记到首次连通。',
    planAppPoints: ['按页面步骤即可完成', '登记密钥后自动建服务器', '每次购买仅搭建一次服务器', '设备配置可反复追加'],
    planAppBest: '适合愿意自己点几步的人',
    planSetupName: 'DIY + 支持',
    planSetupPrice: 'S$118',
    planSetupDesc: '自助（S$18）与在线支持（S$100）两件套。含向导与 WhatsApp 远程协助。',
    planSetupPoints: ['含自助建服', '在线协助（约60分钟）', '确认 VPN 已启动', '一起添加多台设备配置'],
    planSetupBest: '适合希望一开始就有人一起做的人',
    needTitle: '你需要准备',
    needPoints: ['邮箱地址', '信用卡'],
    needLead:
      '用上述邮箱与信用卡，在 Jittee 指定的云上签约；随后我们在该云账号上搭建你的专属 VPN 服务器（工具费通过 PayNow 支付）。',
    faqTitle: '常见问题',
    faqs: [
      {
        q: '有没有按月的 VPN 费用？',
        a: '没有。在云免费额度内，月运营费基本为零。Stripe 只收一次性工具费（以及可选的代设费）。',
      },
      {
        q: '我担心自己用不了云服务。',
        a: '我们选用可在免费额度内长期运行的云，一直开着没问题。想停用时直接注销云账号即可，没有额外费用，当天就能解约。',
      },
      {
        q: '和 NordVPN 等有什么不同？',
        a: '本质上是不同的工具。有名 VPN 更容易进封锁名单，因「是 VPN」被拦。MinorWire 走相反方向 — 只属于你的轻量出口；某次测量中 Anonymizing VPN = No（非永久保证）。客户要的是日常出口，不是犯罪用的人群匿名。绝对匿名不是产品目标（云厂商可依法令披露）。大型 VPN 即使宣传无日志，重大案件仍会披露。允许列表固定 IP 与设备间私有连接更适合自建。详见上方对比表与已验证服务。',
      },
      {
        q: '能让我匿名吗？',
        a: '绝对匿名不是目标。云厂商可依法令请求披露，滥用投诉也会发到租户名义的你。另一方面，仅凭出口 IP，第三方通常难以认出你是谁。若需要犯罪用的人群匿名，本产品不适合。',
      },
      {
        q: '会保存我的 API 密钥吗？',
        a: '会。登记的云 API 密钥会加密保存，以便日后重建服务器（浏览器表单在提交后清空）。请妥善保管该密钥。若你删除 API 密钥，将无法重建，Jittee 对此不承担责任。为追加设备配置，实例连接密钥也会加密保存。',
      },
      {
        q: '如果 Stop / Terminate 实例会怎样？',
        a: '在 OCI 控制台 Stop 或 Terminate 实例后，将无法连接 VPN 服务器。误删时，仅可使用首次登记且仍有效的 API 密钥重建。',
      },
      {
        q: '可以连多少台设备？',
        a: '每次购买搭建一次服务器（可用登记密钥重建）。设备配置可随时追加。同时轻度使用更现实的是数台到约十台。',
      },
    ],
    finalTitle: '先选自己设置，还是请人设置。',
    finalDesc: '两种方式付款后都会立刻进入设置向导。不确定时选代设更稳妥。',
    paidAppTitle: '感谢付款（自己设置）',
    paidAppBody: '请继续打开设置向导。邮件中也有同样的链接。',
    paidSetupTitle: '感谢付款（代为设置）',
    paidSetupBody: '请使用向导，并邮件联系 info@jittee.com 安排远程协助。',
    paidMailCta: '发邮件',
  },
}

function PaidBanner({ c }: { c: Copy }) {
  const params = useSearchParams()
  const paid = params.get('paid')
  if (paid !== 'app' && paid !== 'setup' && paid !== 'bundle' && paid !== 'support') return null

  const title =
    paid === 'app' ? c.paidAppTitle : paid === 'support' ? c.paidSetupTitle : c.paidSetupTitle
  const body =
    paid === 'app' ? c.paidAppBody : paid === 'support' ? c.paidSetupBody : c.paidSetupBody
  const subject =
    paid === 'app'
      ? 'MinorWire self-serve purchase'
      : paid === 'support'
        ? 'MinorWire support purchase'
        : 'MinorWire DIY + support purchase'

  return (
    <div className="relative z-10 border-b border-[#2f6b4f]/30 bg-[#1d3d2e] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className={`${syne.className} font-bold text-lg`}>{title}</p>
          <p className="mt-1 text-sm text-[#cfe7da] leading-relaxed">{body}</p>
        </div>
        <a
          href={`mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent(subject)}`}
          className="inline-flex justify-center px-5 py-2.5 rounded-md bg-white text-[#1d3d2e] font-semibold shrink-0"
        >
          {c.paidMailCta}
        </a>
      </div>
    </div>
  )
}

function MinorWireContent() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja
  const { links } = useMinorWireStripeMode()

  return (
    <div className={`${dmSans.className} bg-[#f3f6f4] text-[#14201a]`}>
      <Suspense fallback={null}>
        <PaidBanner c={c} />
      </Suspense>

      <section className="relative min-h-[88vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, #9fd6b8 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 10% 80%, #cfe7da 0%, transparent 50%), linear-gradient(160deg, #e8f2ec 0%, #f7faf8 45%, #d9ebe2 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,32,26,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,32,26,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="mb-6">
            <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f]">
              {c.badge}
            </p>
          </div>
          <h1
            className={`${syne.className} text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight max-w-4xl`}
          >
            MinorWire
          </h1>
          <p className={`${syne.className} mt-6 text-2xl sm:text-3xl font-semibold text-[#1d3d2e] max-w-2xl`}>
            {c.heroTitle}
          </p>
          <p className="mt-5 text-lg text-[#3a4f44] max-w-xl leading-relaxed">{c.heroDesc}</p>
          <div className="mt-6 max-w-xl border-l-2 border-[#2f6b4f] pl-4">
            <p className="font-semibold text-[#1d3d2e]">{c.freeOpsTitle}</p>
            <p className="mt-1 text-[#3a4f44] leading-relaxed">{c.freeOpsBody}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={links.app}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
            <a
              href={links.bundle}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md border border-[#1d3d2e]/30 bg-white/70 backdrop-blur font-semibold hover:bg-white transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
          <p className="mt-4 text-sm text-[#5a6f64]">{c.ctaNote}</p>
        </div>
      </section>

      <section className="bg-[#1d3d2e] text-[#e8f2ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <h2
            className={`${syne.className} text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-3xl leading-tight`}
          >
            {c.teaserTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#cfe7da] max-w-2xl leading-relaxed">
            {c.teaserBody}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.conceptTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-10">{c.conceptDesc}</p>

        <h3 className={`${syne.className} text-2xl font-bold mb-3`}>{c.deliveryTitle}</h3>
        <p className="text-[#3a4f44] max-w-3xl leading-relaxed mb-8">{c.deliveryLead}</p>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center max-w-5xl">
          <svg
            viewBox="0 0 560 320"
            role="img"
            aria-label={`${c.deliveryCloud}: ${c.deliveryCloudWho}. ${c.deliveryServer}: ${c.deliveryServerWho}.`}
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="mwCloudFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dff0e7" />
                <stop offset="100%" stopColor="#c5dfd1" />
              </linearGradient>
            </defs>
            <ellipse cx="280" cy="210" rx="210" ry="58" fill="#b7d4c4" opacity="0.45" />
            <path
              d="M145 175c0-48 38-86 86-86 14 0 27 3 39 9 14-36 49-61 90-61 54 0 98 44 98 98 0 4 0 8-1 12 32 8 55 37 55 71 0 41-33 74-74 74H168c-45 0-81-36-81-81 0-33 20-62 48-74z"
              fill="url(#mwCloudFill)"
              stroke="#2f6b4f"
              strokeWidth="3"
            />
            <rect x="220" y="145" width="120" height="88" rx="10" fill="#1d3d2e" />
            <rect x="232" y="158" width="96" height="10" rx="3" fill="#7dba98" />
            <rect x="232" y="176" width="96" height="10" rx="3" fill="#7dba98" opacity="0.75" />
            <rect x="232" y="194" width="96" height="10" rx="3" fill="#7dba98" opacity="0.5" />
            <circle cx="318" cy="214" r="5" fill="#9fd6b8" />
            <text
              x="280"
              y="128"
              textAnchor="middle"
              fill="#14201a"
              fontSize="18"
              fontWeight="700"
              fontFamily="system-ui,sans-serif"
            >
              {c.deliveryServer}
            </text>
            <text
              x="280"
              y="268"
              textAnchor="middle"
              fill="#2f6b4f"
              fontSize="16"
              fontWeight="700"
              fontFamily="system-ui,sans-serif"
            >
              {c.deliveryCloud}
            </text>
          </svg>

          <div className="space-y-6">
            <div className="border-l-2 border-[#7dba98] pl-4">
              <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-semibold">{c.deliveryCloud}</p>
              <p className="mt-1 text-lg text-[#14201a] font-semibold leading-relaxed">{c.deliveryCloudWho}</p>
            </div>
            <div className="border-l-2 border-[#1d3d2e] pl-4">
              <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-semibold">{c.deliveryServer}</p>
              <p className="mt-1 text-lg text-[#14201a] font-semibold leading-relaxed">{c.deliveryServerWho}</p>
            </div>
            <p className="text-[#3a4f44] leading-relaxed">{c.deliveryGuide}</p>
            <p className="text-[#3a4f44] leading-relaxed font-medium">{c.deliveryTogether}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.compareTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-4">{c.compareIntro}</p>
        <p
          className={`${syne.className} text-xl sm:text-2xl font-bold text-[#1d3d2e] max-w-3xl leading-snug mb-8`}
        >
          {c.compareThesis}
        </p>

        <div className="overflow-x-auto border border-[#1d3d2e]/15 bg-white/70">
          <table className="w-full min-w-[40rem] text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b border-[#1d3d2e]/15 bg-[#e8f2ec]">
                <th className={`${syne.className} px-4 py-3 font-bold text-[#14201a] w-[22%]`} />
                <th className={`${syne.className} px-4 py-3 font-bold text-[#1d3d2e]`}>{c.compareColSelf}</th>
                <th className={`${syne.className} px-4 py-3 font-bold text-[#1d3d2e]`}>
                  {c.compareColCommercial}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.compareRows.map((row) => (
                <tr key={row.label} className="border-b border-[#1d3d2e]/10 last:border-b-0 align-top">
                  <th
                    scope="row"
                    className="px-4 py-3.5 font-semibold text-[#2f6b4f] bg-[#f7faf8]/80 whitespace-nowrap"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3.5 text-[#3a4f44] leading-relaxed">{row.self}</td>
                  <td className="px-4 py-3.5 text-[#3a4f44] leading-relaxed">{row.commercial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 max-w-3xl">
          <h3 className={`${syne.className} text-xl font-bold text-[#1d3d2e] mb-4`}>
            {c.compareStrengthsTitle}
          </h3>
          <ul className="space-y-3 text-[#3a4f44]">
            {c.compareStrengths.map((p) => (
              <li key={p} className="border-l-2 border-[#7dba98] pl-4 leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 max-w-3xl">
          <h3 className={`${syne.className} text-xl font-bold text-[#1d3d2e] mb-3`}>
            {c.compareWhenTitle}
          </h3>
          <p className="text-[#3a4f44] leading-relaxed">{c.compareWhenSelf}</p>
          <p className="mt-3 text-[#3a4f44] leading-relaxed">{c.compareWhenCommercial}</p>
          <p className="mt-3 text-[#14201a] font-medium leading-relaxed">{c.compareWhenBoth}</p>
          <p className="mt-5 text-sm text-[#5a6f64] leading-relaxed border-l-2 border-[#1d3d2e]/20 pl-4">
            {c.compareLatencyNote}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.verifiedTitle}</h2>
        <p className="text-[#3a4f44] max-w-3xl leading-relaxed mb-4">{c.verifiedIntro}</p>
        <p className="text-[#3a4f44] max-w-3xl leading-relaxed mb-4">{c.verifiedReputation}</p>
        <p className="text-[#14201a] font-medium max-w-3xl leading-relaxed mb-8">{c.verifiedWhy}</p>

        <div className="overflow-x-auto border border-[#1d3d2e]/15 bg-white/70 mb-10">
          <table className="w-full min-w-[32rem] text-left text-sm sm:text-base">
            <tbody>
              {c.verifiedRows.map((row) => (
                <tr key={row.service} className="border-b border-[#1d3d2e]/10 last:border-b-0 align-top">
                  <th
                    scope="row"
                    className="px-4 py-3.5 font-semibold text-[#2f6b4f] bg-[#f7faf8]/80 whitespace-nowrap w-[28%]"
                  >
                    {row.service}
                  </th>
                  <td className="px-4 py-3.5 text-[#3a4f44] leading-relaxed">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="max-w-3xl">
          <h3 className={`${syne.className} text-xl font-bold text-[#1d3d2e] mb-4`}>
            {c.verifiedCaveatsTitle}
          </h3>
          <ul className="space-y-3 text-[#3a4f44]">
            {c.verifiedCaveats.map((p) => (
              <li key={p} className="border-l-2 border-[#1d3d2e]/20 pl-4 leading-relaxed text-sm sm:text-base">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#14201a] text-[#e8f2ec] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`${syne.className} text-3xl font-bold mb-12`}>{c.howTitle}</h2>
          <ol className="grid md:grid-cols-3 gap-10">
            {c.steps.map((step, i) => (
              <li key={step.title}>
                <p className={`${syne.className} text-5xl font-bold text-[#7dba98] mb-4`}>{i + 1}</p>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[#b7c9be] leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.chooseTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-4">{c.chooseIntro}</p>
        <h3 className={`${syne.className} text-2xl font-bold mb-10`}>{c.pricingTitle}</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-[#1d3d2e]/15 bg-white/80 p-8">
            <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-medium">{c.planAppName}</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <p className={`${syne.className} text-5xl font-bold`}>{c.planAppPrice}</p>
              <p className="text-lg text-[#5a6f64] line-through">{c.planAppListPrice}</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#2f6b4f]">{c.planAppPromo}</p>
            <p className="mt-1 text-sm font-semibold text-[#2f6b4f]">{c.planAppBest}</p>
            <p className="mt-3 text-[#3a4f44]">{c.planAppDesc}</p>
            <ul className="mt-6 space-y-2 text-[#3a4f44]">
              {c.planAppPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-[#2f6b4f]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={links.app}
              className="mt-8 inline-flex px-5 py-3 bg-[#1d3d2e] text-white font-semibold rounded-md hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
          </div>
          <div className="border border-[#1d3d2e]/25 bg-[#1d3d2e] text-white p-8">
            <p className="text-sm uppercase tracking-wider text-[#9fd6b8] font-medium">{c.planSetupName}</p>
            <p className={`${syne.className} text-5xl font-bold mt-2`}>{c.planSetupPrice}</p>
            <p className="mt-2 text-sm font-semibold text-[#9fd6b8]">{c.planSetupBest}</p>
            <p className="mt-3 text-[#cfe7da]">{c.planSetupDesc}</p>
            <ul className="mt-6 space-y-2 text-[#e8f2ec]">
              {c.planSetupPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-[#9fd6b8]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={links.bundle}
              className="mt-8 inline-flex px-5 py-3 bg-white text-[#1d3d2e] font-semibold rounded-md hover:bg-[#e8f2ec] transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className={`${syne.className} text-3xl font-bold mb-6`}>{c.needTitle}</h2>
        <ul className="space-y-3 text-[#3a4f44] text-lg max-w-3xl">
          {c.needPoints.map((p) => (
            <li key={p} className="border-l-2 border-[#7dba98] pl-4">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg text-[#14201a] font-semibold max-w-3xl leading-relaxed">{c.needLead}</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-8`}>{c.faqTitle}</h2>
        <div className="space-y-8 max-w-3xl">
          {c.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-lg mb-2">{f.q}</h3>
              <p className="text-[#3a4f44] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#1d3d2e]/10 bg-white/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.finalTitle}</h2>
          <p className="text-[#3a4f44] mb-8">{c.finalDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={links.app}
              className="inline-flex justify-center px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
            <a
              href={links.bundle}
              className="inline-flex justify-center px-6 py-3.5 rounded-md border border-[#1d3d2e]/30 font-semibold hover:bg-white transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
          <p className="mt-6 text-sm text-[#5a6f64]">
            <Link href="/contact" className="underline">
              Contact
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default function MinorWirePage() {
  return (
    <Suspense fallback={null}>
      <MinorWireContent />
    </Suspense>
  )
}
