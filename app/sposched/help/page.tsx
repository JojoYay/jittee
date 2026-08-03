'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * SpoSched 使い方・初期設定ガイド (/sposched/help) — 3言語 (ja/en/zh)。
 * 構成: できること → 運用の全体像 → 初期設定ガイド → 各ページの使い方 → AI連携(MCP)
 */

// SpoSched の MCP サーバー (Supabase Edge Function)。ChatGPT/Claude にコネクタとして追加する
const MCP_URL = 'https://yyeleqhfbbjnscaddutx.supabase.co/functions/v1/mcp'

/** MCP サーバー URL のコピー欄 */
function CopyableUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-stretch gap-2 flex-wrap">
      <code className="flex-1 min-w-[12rem] break-all bg-gray-900 text-teal-200 text-xs sm:text-sm rounded-lg px-4 py-3 font-mono">{url}</code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
        className="shrink-0 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

interface Step { title: string; body: string[] }
interface PageRef { name: string; role?: string; desc: string }
interface HelpCopy {
  title: string
  lead: string
  backToIntro: string
  tocTitle: string
  toc: { id: string; label: string }[]
  overviewTitle: string
  overviewBullets: string[]
  flowTitle: string
  flowIntro: string
  flowSteps: string[]
  flowNotes: string[]
  setupTitle: string
  setupIntro: string
  setupSteps: Step[]
  pagesTitle: string
  pagesIntro: string
  pages: PageRef[]
  roleKanji: string
  // AI 連携 (MCP)
  aiTitle: string
  aiIntro: string
  aiEndpointLabel: string
  aiRequirementsTitle: string
  aiRequirements: string[]
  aiClients: { name: string; steps: string[] }[]
  aiExamplesTitle: string
  aiExamples: string[]
  aiCaveatsTitle: string
  aiCaveats: string[]
  ctaTitle: string
  ctaButton: string
}

const COPY: Record<string, HelpCopy> = {
  ja: {
    title: 'SpoSched 使い方・初期設定ガイド',
    lead: 'SpoSchedは、会場を借りて参加費を集めるタイプのイベント（サッカー等）の運営をまるごと管理するアプリです。このページでは、できること・運用の流れ・初期設定・各ページの使い方をまとめています。',
    backToIntro: '← SpoSchedの紹介ページへ',
    tocTitle: '目次',
    toc: [
      { id: 'overview', label: 'SpoSchedでできること' },
      { id: 'flow', label: '運用の全体像' },
      { id: 'setup', label: '初期設定ガイド' },
      { id: 'pages', label: '各ページの使い方' },
      { id: 'ai', label: 'AI連携（MCP）' },
    ],
    overviewTitle: 'SpoSchedでできること',
    overviewBullets: [
      'イベントの告知はカレンダーで。時間・場所・持ち物などをメンバーに伝えられます',
      '参加者は 〇/△/× で出欠を表明。子供を連れて参加する場合の管理もできます',
      '支払いはPayNowが基本。支払い完了のスクリーンショットをアップロードすると、運営に「支払った」ことが伝わります',
      '未払いの人には、LINE公式チャンネルからリマインドを送ることもできます',
      'イベントの写真・動画は画質の劣化なしでアップロードでき、URLを知っている人だけにセキュアに共有できます',
      '日々のアナウンスやリマインドの文面はアプリが自動生成。グループにコピペするだけです',
      'アプリへは公式LINEチャンネルのメニュー、またはURLから直接アクセスします',
    ],
    flowTitle: '運用の全体像 (1イベントの流れ)',
    flowIntro: '通常の会計運用は「出欠を取り、参加者の参加費（定額）と場所代（定額）を団体のプール金の残高に反映する」形で進みます。',
    flowSteps: [
      'イベント管理で予定を登録する（カレンダーに表示され、出欠の受付が始まります）',
      '告知スクリプトでリマインド文を自動生成し、メンバーのグループにコピペして告知',
      '参加者が 〇/△/× で回答し、当日の参加者が確定',
      'イベント後に清算を開く: 参加者ごとの参加費と場所代が会計（プール金）に反映されます',
      '各メンバーは口座管理者へPayNowで支払い、スクリーンショットをアップロード（誰が支払ったかが一目で分かり、管理の手間が最小になります）',
      '未払いの人がいれば、未払い請求スクリプトやLINE自動リマインドで催促',
      'イベントの写真・動画をアップロードしてチームで共有',
    ],
    flowNotes: [
      '会計にあるお金は団体のプール金です。物品購入など、イベント以外の入出金も会計メニューから記録していきます。',
    ],
    setupTitle: '初期設定ガイド',
    setupIntro: '初期設定は「開設チケット」から始まり、おおよそ次の順番で進めます。',
    setupSteps: [
      {
        title: 'STEP 0. 開設チケットで団体を作る',
        body: [
          '運営から「開設チケット」のURLを受け取り、メールアドレスで登録すると、あなたをオーナーとして団体が作成されます。',
        ],
      },
      {
        title: 'STEP 1. 構成を決める（LINEあり / LINEなし）',
        body: [
          'LINE公式チャンネルの有無にかかわらず、メンバー全員が入っている連絡用のグループ（LINEグループやWhatsApp等）は別途必須です。告知スクリプトはそこに貼り付けます。',
          'LINE公式チャンネルを使うメリット: ログインがかんたん／未払いリマインドを自動送信できる。',
          'デメリット: 無料プランはプッシュ送信が月200通まで／LINEを使っていない人（特にローカルの方）には不便。',
          'チームの実情に合わせてどちらでも運用できます。後から追加・変更も可能です。',
        ],
      },
      {
        title: 'STEP 2. LINE連携の設定（使う場合のみ）',
        body: [
          'アプリ設定 → LINE で「LINEを利用する」を選び、Messaging API と LINE Login のチャネルを登録します（画面内に手順ガイドがあります）。',
          '発行される「本登録URL」を公式アカウントのあいさつメッセージに貼ると、友だち追加 → LINEログイン → 団体へ自動参加まで完結します。',
          'すでにメールで登録済みのメンバーは、プロフィールの「LINEを連携」を押すと、現在ログインしているIDにLINEが紐づきます。',
          '続けてリッチメニューも設定しましょう。デフォルトデザイン（出欠・プロフ・支払い・写真の4ボタン）で良ければ、ボタンを1回押すだけで完成します。',
        ],
      },
      {
        title: 'STEP 3. 団体設定（チームカラー・ロゴ・PayNow先）',
        body: [
          'アプリ設定 → 団体 で、チームカラーとロゴを設定します（ログイン画面やヘッダーに反映されます）。',
          'PayNow先（参加費の振込先）を指定します。個人の口座で受け取る場合は、その人に自分のプロフィールでPayNow先を登録してもらい、団体設定で「口座主」として紐づけます（口座主本人の清算は自動で支払済になります）。',
          '振込先がイベントによって変わる場合は、イベント種別や清算ごとに個別に上書きできます。',
        ],
      },
      {
        title: 'STEP 4. イベント種別を作る（ひな形）',
        body: [
          'アプリ設定 → イベント で、よく行うイベントのひな形（名前・場所・時間・参加費・アイコン等）を登録します。イベントはこのひな形をベースにカレンダーへ登録されていきます。',
          'ここでPayNow先を指定すると団体設定の既定を上書きします。何も指定しなければ団体設定のPayNow先が使われます。',
        ],
      },
      {
        title: 'STEP 5. プロフィール設定（各メンバー）',
        body: [
          '各メンバーはプロフィールで、表示名・PayNow先・子供の名前を登録できます。',
          'LINEアカウントとの連携や、表示言語（日本語/英語）の切り替えもここで行います。',
        ],
      },
      {
        title: 'STEP 6. イベントを登録して運用開始',
        body: [
          'イベント管理からイベントをカレンダーに登録します。登録されると参加者が出欠を表明できるようになり、イベントごとに写真をアップロードする場所も作られます。',
          '未来の予定は前もってまとめて入れておくのがおすすめです。',
        ],
      },
    ],
    pagesTitle: '各ページの使い方',
    pagesIntro: 'メニューにある各ページの役割です（「幹事」printは幹事・オーナーのみに表示されます）。',
    pages: [
      { name: 'ホーム', desc: '次の予定と各機能へのショートカット。' },
      { name: 'イベントカレンダー', desc: '月表示のカレンダー。〇/△/× で出欠を回答します。子供連れの人数もここで登録できます。' },
      { name: 'イベント管理', role: '幹事', desc: 'イベントの作成・編集。参加費や場所代の設定、支払い対象になる「ターゲットイベント」の指定、清算を開く操作もここから。' },
      { name: '支払い', desc: '自分に関係する清算の確認と支払い。PayNowで支払い後、スクリーンショットをアップロードすると支払済になります。' },
      { name: '会計', role: '幹事', desc: '団体のプール金の残高と入出金履歴。清算の入金は自動反映され、物品購入などの記帳や領収書の添付もここで行います。' },
      { name: '写真・動画', desc: 'チームアルバム（100GBまで無料）。メンバーがアップロードでき、共有リンクを知っている人は誰でも閲覧・ダウンロードできます。' },
      { name: '告知スクリプト', role: '幹事', desc: 'リマインド・清算案内・未払い請求の文面を実データから自動生成。手直ししてグループにコピペします。' },
      { name: 'メンバー', role: '幹事', desc: 'メンバーの招待（QR/URL）、幹事⇔メンバーの役割変更、オーナーの移譲。' },
      { name: 'アプリ設定', role: '幹事', desc: '団体（カラー・ロゴ・PayNow先）、イベント種別、メニュー表示、LINE連携、プランと支払い。' },
      { name: 'プロフィール', desc: '表示名・PayNow先・子供の登録、LINE連携、表示言語の切替。' },
    ],
    roleKanji: '幹事',
    aiTitle: 'AI連携（MCP）— ChatGPT / Claude から操作する',
    aiIntro: 'SpoSched は MCP（Model Context Protocol）に対応しています。お使いの ChatGPT や Claude に SpoSched の MCP サーバーを接続すると、「来週末の試合、空きがあれば出席を〇にして」のように、普段の言葉でイベント作成・出欠登録・状況確認などを操作できます。',
    aiEndpointLabel: 'SpoSched MCP サーバーの URL',
    aiRequirementsTitle: '事前に必要なもの',
    aiRequirements: [
      'SpoSched のアカウント（いずれかの団体に参加済み）',
      'MCP（コネクタ）に対応した ChatGPT または Claude。プランによっては有料プランや管理者の許可が必要な場合があります',
      '上記の MCP サーバー URL',
    ],
    aiClients: [
      { name: 'ChatGPT の場合', steps: [
        '設定 → アプリ（Apps）→ 詳細設定（Advanced Settings）を開く',
        '「開発者モード（Developer Mode）」をオンにする',
        '「アプリを追加（Add App）」を選ぶ',
        '上の MCP サーバー URL を入力する',
        'SpoSched のアカウントでログイン（認証）する',
        '「来週末の試合、空きがあれば出席を〇にして」などと話しかけて動作を確認',
      ] },
      { name: 'Claude の場合', steps: [
        '設定（歯車アイコン）を開く',
        'コネクタ（Connectors）→「カスタムコネクタを追加（Add Custom Connector）」を選ぶ',
        '上の MCP サーバー URL を貼り付ける',
        '表示に従って SpoSched のアカウントでログインする',
        'アクセス権限を許可して「保存（Save）」',
        'サンプルの指示を送って接続を確認',
      ] },
    ],
    aiExamplesTitle: '話しかけ方の例',
    aiExamples: [
      '来週末のサッカーって参加可能かな？まだ空きがあれば出席を〇にしておいて',
      '新しいイベントを水曜に、ピッチAで19時から。あとはいつもの条件で作って',
      '今週のイベントで、まだ支払いが済んでいない人を教えて',
      '来月の出欠状況をまとめて',
    ],
    aiCaveatsTitle: '注意点',
    aiCaveats: [
      '画面の名称や場所は、ChatGPT / Claude のバージョン・地域・プランによって多少異なります。',
      '接続には SpoSched アカウントでの認証と権限の許可が必要です（許可した範囲の操作のみ行われます）。',
      'Gemini は現状 Web 版では MCP に非対応です（CLI 等での利用は可能）。',
    ],
    ctaTitle: '導入のご相談・ご質問はお気軽にどうぞ',
    ctaButton: 'お問い合わせ',
  },
  en: {
    title: 'SpoSched Guide: Setup & How to Use',
    lead: 'SpoSched manages events where you rent a venue and collect fees from participants (soccer and more). This page covers what it does, how a typical event runs, initial setup, and what each page is for.',
    backToIntro: '← Back to the SpoSched introduction',
    tocTitle: 'Contents',
    toc: [
      { id: 'overview', label: 'What SpoSched does' },
      { id: 'flow', label: 'How it works' },
      { id: 'setup', label: 'Initial setup guide' },
      { id: 'pages', label: 'Page-by-page guide' },
      { id: 'ai', label: 'AI integration (MCP)' },
    ],
    overviewTitle: 'What SpoSched does',
    overviewBullets: [
      'Announce events on a calendar — share time, place and what to bring',
      'Members RSVP with 〇/△/×. Bringing children is supported too',
      'Payments are via PayNow: uploading a payment screenshot tells the organizers you have paid',
      'Unpaid members can be reminded via your official LINE channel',
      'Event photos & videos upload without quality loss and are shared securely — only people with the link can view',
      'Daily announcements and reminders are auto-generated by the app; just copy-paste into your group',
      'Access the app from the official LINE channel menu or directly by URL',
    ],
    flowTitle: 'How it works (one event, start to finish)',
    flowIntro: 'The usual accounting flow: take attendance, then apply each participant\'s fixed fee and the fixed venue cost against the team\'s pooled balance.',
    flowSteps: [
      'Register the event in Event Management (it appears on the calendar and RSVPs open)',
      'Generate a reminder with Announcement Scripts and paste it into your members\' group',
      'Members answer 〇/△/× and the attendee list firms up',
      'After the event, open the settlement: fees per participant and the venue cost flow into the team accounting',
      'Each member pays the account holder via PayNow and uploads a screenshot — who has paid is visible at a glance, keeping admin work minimal',
      'If anyone has not paid, chase with the unpaid-reminder script or automatic LINE reminders',
      'Upload event photos & videos and share them with the team',
    ],
    flowNotes: [
      'Money in Accounting is the team\'s pooled fund. Record other income/expenses (equipment purchases etc.) from the Accounting menu.',
    ],
    setupTitle: 'Initial setup guide',
    setupIntro: 'Setup starts with a "creation ticket" and proceeds roughly in this order.',
    setupSteps: [
      {
        title: 'STEP 0. Create your team with a creation ticket',
        body: [
          'Receive a "creation ticket" URL from the operators and register with your email — your team is created with you as the owner.',
        ],
      },
      {
        title: 'STEP 1. Decide your structure (with or without LINE)',
        body: [
          'Whether or not you use an official LINE channel, a communication group that all members belong to (LINE group, WhatsApp, etc.) is required — announcement scripts get pasted there.',
          'Pros of an official LINE channel: easy login and automatic unpaid-payment reminders.',
          'Cons: the free plan is limited to ~200 push messages/month, and it is inconvenient for people who do not use LINE (especially locals).',
          'Either structure works, and you can add or change it later.',
        ],
      },
      {
        title: 'STEP 2. LINE integration (only if you use it)',
        body: [
          'In App Settings → LINE, choose "Use LINE" and register your Messaging API and LINE Login channels (a step-by-step guide is on the page).',
          'Paste the issued registration URL into the official account\'s greeting message — add friend → LINE login → auto-join, all in one flow.',
          'Members who already registered by email can tap "Link LINE" on their profile to attach LINE to their current account.',
          'Then set up the rich menu. If the default design (RSVP / Profile / Pay / Media, 4 buttons) works for you, it is a single click.',
        ],
      },
      {
        title: 'STEP 3. Team settings (color, logo, PayNow recipient)',
        body: [
          'In App Settings → Team, set your team color and logo (reflected on the login screen and header).',
          'Set the PayNow recipient for fees. If an individual receives the money, have that person register their PayNow details on their profile, then link them as the "account holder" in team settings (the holder\'s own settlement rows are automatically marked paid).',
          'If the recipient changes per event, you can override it per event type or per settlement.',
        ],
      },
      {
        title: 'STEP 4. Create event types (templates)',
        body: [
          'In App Settings → Events, register templates for the events you run often (name, place, time, fee, icon, etc.). Calendar events are created from these templates.',
          'A PayNow recipient set here overrides the team default; leave it empty to use the team setting.',
        ],
      },
      {
        title: 'STEP 5. Profile settings (each member)',
        body: [
          'Each member can register their display name, PayNow details, and children\'s names on their profile.',
          'Linking a LINE account and switching the display language (Japanese/English) also happen here.',
        ],
      },
      {
        title: 'STEP 6. Register events and start running',
        body: [
          'Register events on the calendar from Event Management. Once registered, members can RSVP, and a photo upload spot is created per event.',
          'We recommend entering future events in advance.',
        ],
      },
    ],
    pagesTitle: 'Page-by-page guide',
    pagesIntro: 'What each menu page is for ("Organizer" pages are visible to organizers/owners only).',
    pages: [
      { name: 'Home', desc: 'Next event and shortcuts to every feature.' },
      { name: 'Event Calendar', desc: 'Monthly calendar. RSVP with 〇/△/×, including how many children you bring.' },
      { name: 'Event Management', role: 'Organizer', desc: 'Create and edit events, set fees and venue cost, mark the "target event" for payments, and open settlements.' },
      { name: 'Payments', desc: 'See settlements that involve you and pay. After paying via PayNow, upload the screenshot to be marked as paid.' },
      { name: 'Accounting', role: 'Organizer', desc: 'The team\'s pooled balance and transaction history. Settlement income flows in automatically; record purchases and attach receipts here.' },
      { name: 'Photos & Videos', desc: 'The team album (up to 100GB free). Members upload; anyone with the share link can view and download.' },
      { name: 'Announcements', role: 'Organizer', desc: 'Auto-generate reminder, settlement and unpaid-chasing texts from real data, tweak, and copy-paste into your group.' },
      { name: 'Members', role: 'Organizer', desc: 'Invite members (QR/URL), switch organizer/member roles, transfer ownership.' },
      { name: 'App Settings', role: 'Organizer', desc: 'Team (color/logo/PayNow), event types, menu display, LINE integration, plan & payment.' },
      { name: 'Profile', desc: 'Display name, PayNow details, children, LINE link, display language.' },
    ],
    roleKanji: 'Organizer',
    aiTitle: 'AI integration (MCP) — operate from ChatGPT / Claude',
    aiIntro: 'SpoSched supports MCP (Model Context Protocol). Connect the SpoSched MCP server to the ChatGPT or Claude you already use, and you can create events, set RSVPs and check status in plain language — for example, “If there\'s a spot in next weekend\'s game, mark me as attending.”',
    aiEndpointLabel: 'SpoSched MCP server URL',
    aiRequirementsTitle: 'What you need first',
    aiRequirements: [
      'A SpoSched account (already a member of a team)',
      'A ChatGPT or Claude that supports MCP (connectors). Depending on the plan, a paid plan or admin approval may be required',
      'The MCP server URL above',
    ],
    aiClients: [
      { name: 'For ChatGPT', steps: [
        'Open Settings → Apps → Advanced Settings',
        'Turn on Developer Mode',
        'Choose Add App',
        'Enter the MCP server URL above',
        'Log in (authenticate) with your SpoSched account',
        'Test by asking, e.g. “If there\'s a spot in next weekend\'s game, mark me as attending”',
      ] },
      { name: 'For Claude', steps: [
        'Open Settings (gear icon)',
        'Go to Connectors → Add Custom Connector',
        'Paste the MCP server URL above',
        'Log in with your SpoSched account when prompted',
        'Allow the access permissions and click Save',
        'Send a sample instruction to confirm the connection',
      ] },
    ],
    aiExamplesTitle: 'Example prompts',
    aiExamples: [
      'Can I make it to next weekend\'s game? If there\'s still a spot, set my attendance to attending.',
      'Create a new event on Wednesday, Pitch A from 7pm — everything else as usual.',
      'Who still hasn\'t paid for this week\'s event?',
      'Summarize next month\'s attendance.',
    ],
    aiCaveatsTitle: 'Notes',
    aiCaveats: [
      'Menu names and locations vary somewhat by ChatGPT / Claude version, region and plan.',
      'Connecting requires authenticating with your SpoSched account and granting permissions (only the scopes you allow are used).',
      'Gemini currently has no MCP support in its web interface (CLI usage is possible).',
    ],
    ctaTitle: 'Questions about getting started? Get in touch.',
    ctaButton: 'Contact us',
  },
  zh: {
    title: 'SpoSched 使用与初始设置指南',
    lead: 'SpoSched 可以完整管理“租借场地并向参加者收取费用”类型的活动（足球等）。本页汇总了功能概览、运营流程、初始设置以及各页面的使用方法。',
    backToIntro: '← 返回 SpoSched 介绍页',
    tocTitle: '目录',
    toc: [
      { id: 'overview', label: 'SpoSched 能做什么' },
      { id: 'flow', label: '运营全景' },
      { id: 'setup', label: '初始设置指南' },
      { id: 'pages', label: '各页面使用方法' },
      { id: 'ai', label: 'AI 联动（MCP）' },
    ],
    overviewTitle: 'SpoSched 能做什么',
    overviewBullets: [
      '在日历上发布活动：时间、地点、需要携带的物品等一目了然',
      '参加者用 〇/△/× 表明出席意向，携带孩子参加也能管理',
      '付款以 PayNow 为主：上传付款截图后，管理者即可知道“已付款”',
      '可通过 LINE 官方频道向未付款的成员发送提醒',
      '活动的照片与视频可无损上传，并且只有知道链接的人才能安全地查看',
      '日常公告和提醒的文案由应用自动生成，复制粘贴到群里即可',
      '通过官方 LINE 频道菜单或直接通过 URL 访问应用',
    ],
    flowTitle: '运营全景（一场活动的流程）',
    flowIntro: '通常的记账方式是：先收集出席情况，再把参加费（定额）和场地费（定额）计入团队资金池的余额中。',
    flowSteps: [
      '在“活动管理”中登记活动（显示在日历上并开始接受出席回复）',
      '用“公告脚本”自动生成提醒文案，粘贴到成员群里进行通知',
      '参加者用 〇/△/× 回复，确定当天的参加名单',
      '活动结束后打开结算：每位参加者的费用与场地费自动计入团队账目（资金池）',
      '每位成员通过 PayNow 向账户管理人付款并上传截图（谁已付款一目了然，管理成本最低）',
      '如有未付款者，用“催款脚本”或 LINE 自动提醒进行催付',
      '上传活动照片和视频，与团队共享',
    ],
    flowNotes: [
      '账目中的钱是团队的资金池。购买物品等其他收支也从“记账”菜单中记录。',
    ],
    setupTitle: '初始设置指南',
    setupIntro: '初始设置从“开设券”开始，大致按以下顺序进行。',
    setupSteps: [
      {
        title: 'STEP 0. 用开设券创建团队',
        body: ['从运营方获取“开设券”URL，用电子邮箱注册后，即以您为所有者创建团队。'],
      },
      {
        title: 'STEP 1. 决定架构（用 LINE / 不用 LINE）',
        body: [
          '无论是否使用 LINE 官方频道，都必须另有一个全员参加的沟通群（LINE 群或 WhatsApp 等），公告脚本就贴在那里。',
          '使用 LINE 官方频道的优点：登录方便、可自动发送催款提醒。',
          '缺点：免费方案每月约 200 条推送上限；对不使用 LINE 的人（尤其是本地人）不方便。',
          '两种架构都可以运营，之后也能添加或更改。',
        ],
      },
      {
        title: 'STEP 2. 设置 LINE 联动（仅在使用时）',
        body: [
          '在 应用设置 → LINE 中选择“使用 LINE”，注册 Messaging API 和 LINE Login 频道（页面内有分步指南）。',
          '把签发的“正式注册 URL”贴到官方账号的问候消息中：加好友 → LINE 登录 → 自动加入团队一步完成。',
          '已用邮箱注册的成员，在个人资料中点“关联 LINE”，即可把 LINE 绑定到当前账号。',
          '接着设置丰富菜单。如果默认设计（出席・资料・付款・照片 4 按钮）合适，点一下按钮即可完成。',
        ],
      },
      {
        title: 'STEP 3. 团队设置（颜色・Logo・PayNow 收款方）',
        body: [
          '在 应用设置 → 团队 中设置团队颜色和 Logo（会反映到登录页和顶栏）。',
          '指定参加费的 PayNow 收款方。若由个人账户收款，请让该成员在个人资料中登记自己的 PayNow，然后在团队设置中把他绑定为“账户持有人”（其本人的结算行会自动标记为已付）。',
          '如果收款方因活动而异，可在活动类型或每次结算中单独覆盖。',
        ],
      },
      {
        title: 'STEP 4. 创建活动类型（模板）',
        body: [
          '在 应用设置 → 活动 中登记常见活动的模板（名称、地点、时间、费用、图标等）。日历上的活动将基于这些模板创建。',
          '在此指定的 PayNow 收款方会覆盖团队默认设置；不指定则使用团队设置。',
        ],
      },
      {
        title: 'STEP 5. 个人资料设置（每位成员）',
        body: [
          '每位成员可在个人资料中登记显示名、PayNow 收款信息、孩子的名字。',
          '关联 LINE 账号、切换显示语言（日语/英语）也在这里进行。',
        ],
      },
      {
        title: 'STEP 6. 登记活动并开始运营',
        body: [
          '从“活动管理”把活动登记到日历。登记后成员即可回复出席，并会为每场活动创建照片上传位置。',
          '建议提前把未来的活动安排批量录入。',
        ],
      },
    ],
    pagesTitle: '各页面使用方法',
    pagesIntro: '菜单中各页面的用途（标注“干事”的页面仅干事/所有者可见）。',
    pages: [
      { name: '主页', desc: '下一场活动与各功能的快捷入口。' },
      { name: '活动日历', desc: '月历视图。用 〇/△/× 回复出席，携带孩子的人数也在这里登记。' },
      { name: '活动管理', role: '干事', desc: '创建和编辑活动，设置费用与场地费，指定作为付款对象的“目标活动”，打开结算。' },
      { name: '付款', desc: '查看与自己相关的结算并付款。PayNow 付款后上传截图即标记为已付。' },
      { name: '记账', role: '干事', desc: '团队资金池的余额与收支记录。结算收入自动计入，物品购买与收据附件也在这里。' },
      { name: '照片・视频', desc: '团队相册（免费 100GB）。成员上传，知道共享链接的人都能查看和下载。' },
      { name: '公告脚本', role: '干事', desc: '基于真实数据自动生成提醒、结算通知、催款文案，修改后复制到群里。' },
      { name: '成员', role: '干事', desc: '邀请成员（QR/URL）、切换干事⇔成员角色、转让所有者。' },
      { name: '应用设置', role: '干事', desc: '团队（颜色/Logo/PayNow）、活动类型、菜单显示、LINE 联动、方案与付款。' },
      { name: '个人资料', desc: '显示名、PayNow、孩子登记、LINE 关联、显示语言切换。' },
    ],
    roleKanji: '干事',
    aiTitle: 'AI 联动（MCP）— 从 ChatGPT / Claude 操作',
    aiIntro: 'SpoSched 支持 MCP（Model Context Protocol）。把 SpoSched 的 MCP 服务器连接到你常用的 ChatGPT 或 Claude，就能用日常的话创建活动、登记出席、查询状态——例如“下周末的比赛如果还有空位，就把我设为出席”。',
    aiEndpointLabel: 'SpoSched MCP 服务器 URL',
    aiRequirementsTitle: '事先需要准备',
    aiRequirements: [
      'SpoSched 账号（已加入某个团队）',
      '支持 MCP（连接器）的 ChatGPT 或 Claude；视方案而定，可能需要付费方案或管理员授权',
      '上面的 MCP 服务器 URL',
    ],
    aiClients: [
      { name: 'ChatGPT', steps: [
        '打开 设置 → 应用（Apps）→ 高级设置（Advanced Settings）',
        '开启“开发者模式（Developer Mode）”',
        '选择“添加应用（Add App）”',
        '输入上面的 MCP 服务器 URL',
        '用 SpoSched 账号登录（认证）',
        '试着说“下周末的比赛如果还有空位就把我设为出席”来确认',
      ] },
      { name: 'Claude', steps: [
        '打开 设置（齿轮图标）',
        '进入 连接器（Connectors）→“添加自定义连接器（Add Custom Connector）”',
        '粘贴上面的 MCP 服务器 URL',
        '按提示用 SpoSched 账号登录',
        '允许访问权限并点击“保存（Save）”',
        '发送一条示例指令确认连接',
      ] },
    ],
    aiExamplesTitle: '示例说法',
    aiExamples: [
      '下周末的比赛我能参加吗？如果还有空位，就把我的出席设为○。',
      '周三在 A 场地晚上7点创建一个新活动，其余照常。',
      '本周的活动里还有谁没付款？',
      '汇总下个月的出席情况。',
    ],
    aiCaveatsTitle: '注意事项',
    aiCaveats: [
      '菜单名称与位置会因 ChatGPT / Claude 的版本、地区和方案而略有不同。',
      '连接需要用 SpoSched 账号认证并授予权限（仅在你允许的范围内操作）。',
      'Gemini 目前在网页版不支持 MCP（可通过 CLI 使用）。',
    ],
    ctaTitle: '关于导入的咨询，欢迎随时联系。',
    ctaButton: '联系我们',
  },
}

export default function SpoSchedHelpPage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link href="/sposched" className="text-white/80 text-sm hover:text-white">{c.backToIntro}</Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-3 drop-shadow">{c.title}</h1>
          <p className="text-white/95 max-w-3xl">{c.lead}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* TOC */}
        <nav className="bg-white rounded-xl shadow p-5">
          <p className="text-sm font-bold text-gray-900 mb-2">{c.tocTitle}</p>
          <ul className="grid sm:grid-cols-2 gap-1">
            {c.toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-sm text-blue-600 hover:underline">・{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* できること */}
        <section id="overview" className="scroll-mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🎯 {c.overviewTitle}</h2>
          <div className="bg-white rounded-xl shadow p-6">
            <ul className="space-y-2.5">
              {c.overviewBullets.map((b, i) => (
                <li key={i} className="flex items-start text-gray-700">
                  <span className="text-teal-500 mr-2 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 運用の全体像 */}
        <section id="flow" className="scroll-mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🔄 {c.flowTitle}</h2>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 mb-4">{c.flowIntro}</p>
            <ol className="space-y-3">
              {c.flowSteps.map((s, i) => (
                <li key={i} className="flex items-start text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center mr-3 mt-0.5">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            {c.flowNotes.map((n, i) => (
              <p key={i} className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-md p-3">💡 {n}</p>
            ))}
          </div>
        </section>

        {/* 初期設定ガイド */}
        <section id="setup" className="scroll-mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🛠️ {c.setupTitle}</h2>
          <p className="text-gray-600 mb-4">{c.setupIntro}</p>
          <div className="space-y-4">
            {c.setupSteps.map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <ul className="space-y-2">
                  {s.body.map((p, j) => (
                    <li key={j} className="text-gray-700 leading-relaxed text-sm sm:text-base">{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 各ページの使い方 */}
        <section id="pages" className="scroll-mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">📑 {c.pagesTitle}</h2>
          <p className="text-gray-600 mb-4">{c.pagesIntro}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {c.pages.map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-gray-900">{p.name}</h3>
                  {p.role && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{p.role}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI連携 (MCP) */}
        <section id="ai" className="scroll-mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🤖 {c.aiTitle}</h2>
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <p className="text-gray-600">{c.aiIntro}</p>

            {/* endpoint URL */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">{c.aiEndpointLabel}</p>
              <CopyableUrl url={MCP_URL} />
            </div>

            {/* requirements */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">{c.aiRequirementsTitle}</p>
              <ul className="space-y-2">
                {c.aiRequirements.map((r, i) => (
                  <li key={i} className="flex items-start text-gray-700 text-sm sm:text-base">
                    <span className="text-teal-500 mr-2 mt-0.5">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* per-client steps */}
            <div className="grid sm:grid-cols-2 gap-4">
              {c.aiClients.map((cl, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3">{cl.name}</h3>
                  <ol className="space-y-2.5">
                    {cl.steps.map((s, j) => (
                      <li key={j} className="flex items-start text-gray-700 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold flex items-center justify-center mr-2.5 mt-0.5">{j + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* example prompts */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">{c.aiExamplesTitle}</p>
              <ul className="space-y-2">
                {c.aiExamples.map((e, i) => (
                  <li key={i} className="text-gray-700 text-sm bg-gradient-to-r from-orange-50 to-teal-50 border border-gray-100 rounded-lg px-4 py-2.5">“{e}”</li>
                ))}
              </ul>
            </div>

            {/* caveats */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">{c.aiCaveatsTitle}</p>
              <ul className="space-y-1.5">
                {c.aiCaveats.map((n, i) => (
                  <li key={i} className="text-sm text-gray-500 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-teal-500 to-orange-500 text-white rounded-2xl p-8">
          <p className="font-bold mb-4">{c.ctaTitle}</p>
          <Link href="/contact" className="inline-block bg-white text-teal-600 font-bold px-8 py-3 rounded-full shadow hover:bg-teal-50 transition-colors">
            {c.ctaButton}
          </Link>
        </section>
      </div>
    </div>
  )
}
