'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * SplitBill 紹介ページ — 1ページ・3言語 (ja/en/zh)。
 *
 * アプリ本体 (https://sposched.jittee.com/split/) は**作るだけの画面**にして、
 * 説明はここに置く。初めての人がまずここを読み、納得してから作りに行く。
 *
 * 4コマは絵も文字もこのページの中で完結させている (画像を持たない＝翻訳が効く)。
 */

const APP_URL = 'https://sposched.jittee.com/split/'
const TERMS_URL = 'https://sposched.jittee.com/split/terms/'
const MCP_URL = 'https://sposched.jittee.com/split/mcp/'

const BLUE = '#0072FA'

interface Panel { cap: string; line: string }
interface Faq { q: string; a: string }
interface Copy {
  tagline: string
  lead: string
  cta: string
  ctaNote: string
  painTitle: string
  pains: { icon: string; text: string }[]
  comicTitle: string
  comicNote: string
  panels: [Panel, Panel, Panel, Panel]
  safeTitle: string
  safes: { icon: string; title: string; desc: string }[]
  featTitle: string
  feats: { icon: string; title: string; desc: string }[]
  mcpTitle: string
  mcpLead: string
  mcpSteps: { head: string; body: string }[]
  mcpCode: string
  mcpToolsTitle: string
  mcpTools: { name: string; desc: string }[]
  mcpWarn: string
  mcpCta: string
  faqTitle: string
  faqs: Faq[]
  lastTitle: string
  lastDesc: string
  terms: string
}

const COPY: Record<string, Copy> = {
  ja: {
    tagline: '立て替えた分、集めるところまで。',
    lead: '飲み会やコートの予約で、あなたが先に払った。あとは集めるだけ — なのに、その「あとは」が一番面倒です。SplitBill は、一人いくらかを計算して、そのまま請求できるページを作ります。',
    cta: '割り勘を作る（無料）',
    ctaNote: '登録もアプリのインストールも要りません',
    painTitle: 'この「集める」が、いちばん面倒',
    pains: [
      { icon: '🧮', text: '一人いくら？ 飲まなかった人は？ 端数は？' },
      { icon: '📣', text: 'グループチャットで何度も催促するのが気まずい' },
      { icon: '🤔', text: '誰が払って誰がまだなのか、分からなくなる' },
    ],
    comicTitle: '使い方は、4コマぶん',
    comicNote: '読むより早いので、絵で。',
    panels: [
      { cap: '① 立て替える', line: '「ここは出しとくね」— 合計 $505。6人で割ることに。' },
      { cap: '② 金額と人数を入れる', line: '総額と人数、受け取るPayNowを入れるだけ。一人いくらかは自動で出ます。' },
      { cap: '③ できたURLを送る', line: 'グループチャットに貼るだけ。開いた人には自分の金額とQRが出ます。' },
      { cap: '④ 払った人が分かる', line: '送金のスクショが上がると支払済に。誰が残っているか一目で分かります。' },
    ],
    safeTitle: 'お金の扱いについて、正直なところ',
    safes: [
      { icon: '🏦', title: 'お金は当社を通りません', desc: '送金は各自が自分の銀行アプリで直接行います。SplitBill は金額とPayNow先を表示するだけで、預かりも仲介もしません。' },
      { icon: '🗓️', title: '7日で消えます', desc: '最後の支払いから7日で、ページも写真もまとめて自動的に削除されます。延長も保存もできません。' },
      { icon: '🙅', title: '身元の保証はしません', desc: 'このページは誰でも作れます。知らない相手から届いたリンクに送金しないでください。怪しいページは通報できます。' },
    ],
    featTitle: 'ちゃんと現実に合わせられます',
    feats: [
      { icon: '🍺', title: '飲まない人は少なめ', desc: '一人だけ金額を決められます。残りは自動で割り直します。' },
      { icon: '🙋', title: '立て替えた人は払わない', desc: '自分も頭数に入るけれど、自分には請求が飛びません。' },
      { icon: '🧾', title: 'レシートを付けられる', desc: '「本当にこの金額？」に、写真で答えられます。払う人も見られます。' },
      { icon: '👥', title: '大人数は人数だけ', desc: '名前を並べるのが面倒なときは、人数だけ入れればOK。名前は払う人が自分で書きます。' },
      { icon: '✏️', title: 'あとから直せる', desc: '人が増えた・金額が変わった。配ったURLはそのまま、中身だけ直せます。' },
      { icon: '🌏', title: '日本語 / English / 中文', desc: '受け取った人が自分の言葉で読めます。' },
      { icon: '🤖', title: 'AIに任せられる', desc: 'PayNowを一度預けておけば、「このレシート4人で」と言うだけで割り勘ページができます (MCP)。' },
    ],
    mcpTitle: 'AIに任せる (MCP)',
    mcpLead: 'PayNowの宛先を一度預けておくと、あとは AI に「このレシート、4人で割って」と言うだけ。宛先を毎回聞かれることもありません。',
    mcpSteps: [
      { head: '① 接続を作る', body: 'SplitBill の「AIに繋ぐ」を開き、PayNowの宛先と表示名を入れます。つなぐためのURLが1回だけ出るので、控えてください。' },
      { head: '② AIに登録する', body: 'Claude のデスクトップ / Web なら、設定 → コネクタ → カスタムコネクタを追加 → そのURLを貼るだけ。Claude Code は下のコマンドです。' },
      { head: '③ 話しかける', body: '「このレシート、4人で割って。田中は飲んでないから$20で」。管理URLと、配るURLが返ってきます。' },
    ],
    mcpCode: 'claude mcp add --transport http splitbill "<①で出たURL>"',
    mcpToolsTitle: 'AIができること',
    mcpTools: [
      { name: '割り勘を作る', desc: 'レシートの内訳か総額と人数から作り、管理URL・配るURL・見るだけのURLを返します。既定ではあなたが立て替えた扱いです。' },
      { name: '一覧を見る', desc: 'この接続で作った割り勘を新しい順に。いくら集まって、あと何人かが分かります。' },
      { name: '様子を見る', desc: '1つの割り勘の中身。誰が払ったか、ひとこと、配るURL。' },
    ],
    mcpWarn: 'このURLは、あなたのPayNowで集金するページを作れる鍵です。人に渡さないでください。送金はできませんし、お金は当社を通りません。',
    mcpCta: 'AIに繋ぐ',
    faqTitle: 'よくある質問',
    faqs: [
      { q: '本当に登録は要りませんか？', a: '要りません。メールも電話番号も聞きません。作ると「管理URL」が1回だけ出るので、それが鍵になります（無くすと管理できません）。' },
      { q: 'PayNow以外でも使えますか？', a: 'いまはシンガポールのPayNow（携帯番号またはUEN）向けです。NRICは宛先に使えません。' },
      { q: '手数料はかかりますか？', a: 'かかりません。お金が当社を通らないので、取りようがありません。' },
      { q: '払ったかどうかは、どうやって分かりますか？', a: '払った人が送金画面のスクショを上げると支払済になります。自己申告なので、最後は銀行アプリの入金でご確認ください。' },
      { q: 'スクショは誰が見られますか？', a: '管理URLを持っている人（作った人）だけです。ほかの参加者には見えません。' },
    ],
    lastTitle: 'まずは1回、作ってみてください',
    lastDesc: '2分で終わります。要らなくなれば放っておくだけで消えます。',
    terms: '利用規約',
  },
  en: {
    tagline: 'You paid. Now get paid back.',
    lead: 'You covered the dinner or the court booking. All that is left is collecting — and that is the annoying part. SplitBill works out who owes what and gives you a page you can send them.',
    cta: 'Create a split (free)',
    ctaNote: 'No sign-up, no app to install',
    painTitle: 'Collecting is the hard part',
    pains: [
      { icon: '🧮', text: 'How much each? What about the person who did not drink? The odd cents?' },
      { icon: '📣', text: 'Chasing people in the group chat is awkward' },
      { icon: '🤔', text: 'You lose track of who has paid and who has not' },
    ],
    comicTitle: 'The whole thing, in four panels',
    comicNote: 'Faster to look at than to read.',
    panels: [
      { cap: '1. You pay', line: '"I will get this one." $505 in total, six people.' },
      { cap: '2. Enter amount and people', line: 'Total, how many people, and the PayNow that receives it. The per-person amount is worked out for you.' },
      { cap: '3. Send the link', line: 'Paste it in the group chat. Whoever opens it sees their own amount and a QR code.' },
      { cap: '4. See who paid', line: 'They upload their transfer screenshot and they are marked paid. You can see who is left at a glance.' },
    ],
    safeTitle: 'Straight talk about the money',
    safes: [
      { icon: '🏦', title: 'The money never touches us', desc: 'Everyone pays from their own banking app. SplitBill only shows the amount and the PayNow recipient — we never hold or handle funds.' },
      { icon: '🗓️', title: 'Gone in 7 days', desc: 'Seven days after the last payment, the page and every image on it are deleted. No extensions, no archive.' },
      { icon: '🙅', title: 'We do not vouch for anyone', desc: 'Anyone can create one of these pages. Never send money from a link you got from someone you do not know. Suspicious pages can be reported.' },
    ],
    featTitle: 'It bends to how things really are',
    feats: [
      { icon: '🍺', title: 'Not everyone pays the same', desc: 'Fix one person’s amount and the rest is re-split automatically.' },
      { icon: '🙋', title: 'The one who paid up front owes nothing', desc: 'They still count as a head, but no link is created for them.' },
      { icon: '🧾', title: 'Attach the receipts', desc: '"Is that really the amount?" — answer it with a photo. Payers can see it too.' },
      { icon: '👥', title: 'Big group? Just a number', desc: 'Skip the names and enter a head count. Each person types their own name when they pay.' },
      { icon: '✏️', title: 'Change it later', desc: 'Someone joined, the amount changed. Edit the details — the links you already sent keep working.' },
      { icon: '🌏', title: '日本語 / English / 中文', desc: 'Whoever receives the link reads it in their own language.' },
      { icon: '🤖', title: 'Let your AI do it', desc: 'Save your PayNow once, then just say "split this receipt four ways" (MCP).' },
    ],
    mcpTitle: 'Let your AI do it (MCP)',
    mcpLead: 'Save your PayNow details once, then just tell your AI "split this receipt four ways". It never asks for your PayNow again.',
    mcpSteps: [
      { head: '1. Create a connection', body: 'Open "Connect to your AI" in SplitBill and enter your PayNow recipient and display name. You get a URL — shown only once, so keep it.' },
      { head: '2. Add it to your AI', body: 'In Claude desktop or web: Settings → Connectors → Add custom connector → paste the URL. For Claude Code, use the command below.' },
      { head: '3. Just ask', body: '"Split this receipt four ways. Tanaka did not drink, so $20 for him." You get back the admin link and the links to share.' },
    ],
    mcpCode: 'claude mcp add --transport http splitbill "<the URL from step 1>"',
    mcpToolsTitle: 'What the AI can do',
    mcpTools: [
      { name: 'Create a split', desc: 'From a receipt or a total plus a head count. Returns the admin link, the links to share and a read-only status link. By default you are the one who paid up front.' },
      { name: 'List your splits', desc: 'Everything created through this connection, newest first, with how much has come in and who is left.' },
      { name: 'Check one', desc: 'Who has paid, their notes, and the links to share.' },
    ],
    mcpWarn: 'That URL can create pages that collect money to your PayNow. Do not share it. It cannot move money, and money never passes through us.',
    mcpCta: 'Connect to your AI',
    faqTitle: 'Questions people ask',
    faqs: [
      { q: 'Really no sign-up?', a: 'Really. No email, no phone number. You get an admin link once when you create it — that link is the key, so keep it.' },
      { q: 'Does it work outside PayNow?', a: 'Today it is built for Singapore PayNow (mobile number or UEN). NRIC cannot be used as the recipient.' },
      { q: 'What does it cost?', a: 'Nothing. The money never passes through us, so there is nothing to take a cut of.' },
      { q: 'How do I know someone paid?', a: 'They upload a screenshot of the transfer and get marked paid. It is self-reported, so confirm the money in your banking app.' },
      { q: 'Who can see the screenshots?', a: 'Only whoever holds the admin link — the person who created the split. Other payers cannot see them.' },
    ],
    lastTitle: 'Try it once',
    lastDesc: 'It takes two minutes. If you stop using it, it deletes itself.',
    terms: 'Terms of use',
  },
  zh: {
    tagline: '你先付的錢，好好收回來。',
    lead: '聚餐或訂場地，你先付了。剩下就是收錢 — 偏偏這件事最麻煩。SplitBill 幫你算好每人多少，並產生一個可以直接發出去的收款頁面。',
    cta: '建立均攤（免費）',
    ctaNote: '不用註冊，也不用安裝 App',
    painTitle: '「收錢」才是最麻煩的一步',
    pains: [
      { icon: '🧮', text: '每人多少？沒喝酒的人呢？零頭怎麼算？' },
      { icon: '📣', text: '在群組裡一催再催，很尷尬' },
      { icon: '🤔', text: '誰付了、誰還沒付，自己都搞不清楚' },
    ],
    comicTitle: '四格就講完',
    comicNote: '用看的比用讀的快。',
    panels: [
      { cap: '① 你先付', line: '「這攤我先付」— 總共 $505，六個人分。' },
      { cap: '② 輸入金額與人數', line: '填總額、人數，以及收款的 PayNow。每人多少會自動算好。' },
      { cap: '③ 把連結發出去', line: '貼到群組就好。打開的人會看到自己的金額和 QR 碼。' },
      { cap: '④ 一眼看誰付了', line: '對方上傳轉帳截圖就標記為已付款，誰還沒付一目了然。' },
    ],
    safeTitle: '關於金流，說清楚',
    safes: [
      { icon: '🏦', title: '款項不經過我們', desc: '每個人都用自己的銀行 App 轉帳。SplitBill 只顯示金額與 PayNow 收款資訊，不保管也不代收。' },
      { icon: '🗓️', title: '7 天後自動刪除', desc: '最後一次付款後 7 天，頁面與所有圖片會一併刪除，不能延長也不會留存。' },
      { icon: '🙅', title: '我們不擔保任何人', desc: '任何人都能建立這種頁面。請勿依陌生人傳來的連結轉帳；可疑頁面可以檢舉。' },
    ],
    featTitle: '配合真實情況',
    feats: [
      { icon: '🍺', title: '有人可以少付', desc: '單獨指定某人的金額，其餘會自動重新分攤。' },
      { icon: '🙋', title: '先墊付的人不用再付', desc: '仍計入人數，但不會產生他的付款連結。' },
      { icon: '🧾', title: '可以附上收據', desc: '「真的是這個金額嗎？」用照片回答，付款的人也看得到。' },
      { icon: '👥', title: '人多就只填人數', desc: '懶得一個個打名字時，填人數就好，付款時各自填自己的名字。' },
      { icon: '✏️', title: '事後可以修改', desc: '有人加入、金額變了都能改，已經發出去的連結照樣可用。' },
      { icon: '🌏', title: '日本語 / English / 中文', desc: '收到連結的人可以用自己的語言閱讀。' },
      { icon: '🤖', title: '交給 AI 處理', desc: '先存好 PayNow，之後只要說「這張收據四個人分」就能建立 (MCP)。' },
    ],
    mcpTitle: '交給 AI 處理 (MCP)',
    mcpLead: '先存好一次 PayNow 資訊，之後只要對 AI 說「這張收據四個人分」即可，不會再問你收款資訊。',
    mcpSteps: [
      { head: '① 建立連線', body: '打開 SplitBill 的「連接到你的 AI」，填入 PayNow 收款帳號與顯示名稱。連線用的網址只會顯示一次，請先保存。' },
      { head: '② 加入你的 AI', body: 'Claude 桌面版或網頁版：設定 → 連接器 → 新增自訂連接器 → 貼上網址。Claude Code 請用下面的指令。' },
      { head: '③ 直接說', body: '「這張收據四個人分，田中沒喝酒算 $20」。系統會回傳管理連結與分享連結。' },
    ],
    mcpCode: 'claude mcp add --transport http splitbill "<步驟①的網址>"',
    mcpToolsTitle: 'AI 能做的事',
    mcpTools: [
      { name: '建立均攤', desc: '依收據明細或總額加人數建立，回傳管理連結、分享連結與唯讀狀態連結。預設由你先墊付。' },
      { name: '查看清單', desc: '此連線建立過的均攤，由新到舊，含已收金額與剩餘人數。' },
      { name: '查看單筆', desc: '誰付了、備註，以及分享連結。' },
    ],
    mcpWarn: '該網址能建立以你的 PayNow 收款的頁面，請勿分享。它無法轉帳，款項也不會經過我們。',
    mcpCta: '連接到你的 AI',
    faqTitle: '常見問題',
    faqs: [
      { q: '真的不用註冊？', a: '真的。不問 email、也不問電話。建立後會顯示一次「管理連結」，那就是鑰匙，請保存好。' },
      { q: 'PayNow 以外可以用嗎？', a: '目前是為新加坡 PayNow（手機號碼或 UEN）設計的，不可使用 NRIC 作為收款帳號。' },
      { q: '要收費嗎？', a: '不收。款項不經過我們，也就無從收取。' },
      { q: '怎麼知道對方付了？', a: '對方上傳轉帳截圖即標記為已付款。這是自行申報，最後請以銀行 App 的入金為準。' },
      { q: '截圖誰看得到？', a: '只有持有管理連結的人（也就是建立者），其他付款人看不到。' },
    ],
    lastTitle: '先建一個看看',
    lastDesc: '兩分鐘就好。不用了放著就會自動消失。',
    terms: '使用條款',
  },
}

/* ── 4コマの絵。**文字は絵に入れない** (翻訳が効かなくなるので下に出す) ── */

function Face({ x, y, c = BLUE }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill={c} />
      <path d={`M${x - 17} ${y + 31} a17 19 0 0 1 34 0z`} fill={c} />
    </g>
  )
}

function PanelOne() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" role="img" aria-hidden="true">
      <rect x="18" y="96" width="184" height="12" rx="6" fill="#E2E8F0" />
      <ellipse cx="68" cy="94" rx="24" ry="7" fill="#CBD5E1" />
      <ellipse cx="124" cy="94" rx="18" ry="6" fill="#CBD5E1" />
      <Face x={56} y={46} />
      {/* レシート */}
      <g transform="rotate(-8 160 60)">
        <path d="M140 26h44v62l-7-6-7 6-7-6-7 6-7-6-7 6z" fill="#fff" stroke="#94A3B8" strokeWidth="2.5" />
        <path d="M148 40h28M148 52h28M148 64h18" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* 手 */}
      <path d="M74 62 q30 -4 52 -6" stroke={BLUE} strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function PanelTwo() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" role="img" aria-hidden="true">
      <rect x="66" y="12" width="88" height="126" rx="14" fill="#fff" stroke="#94A3B8" strokeWidth="3" />
      <rect x="78" y="30" width="64" height="14" rx="7" fill="#E2E8F0" />
      <rect x="78" y="52" width="64" height="14" rx="7" fill="#E2E8F0" />
      <rect x="78" y="74" width="30" height="12" rx="6" fill="#CBD5E1" />
      <rect x="112" y="74" width="30" height="12" rx="6" fill="#CBD5E1" />
      <rect x="78" y="96" width="64" height="20" rx="10" fill={BLUE} />
      <path d="M92 106h36M122 100l6 6-6 6" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 60l-14 0M46 40l-12 -8M46 80l-12 8" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function PanelThree() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" role="img" aria-hidden="true">
      <rect x="14" y="26" width="82" height="98" rx="12" fill="#fff" stroke="#94A3B8" strokeWidth="3" />
      <rect x="26" y="42" width="58" height="10" rx="5" fill={BLUE} opacity="0.85" />
      <rect x="26" y="60" width="44" height="8" rx="4" fill="#E2E8F0" />
      <rect x="26" y="76" width="52" height="8" rx="4" fill="#E2E8F0" />
      {/* 飛んでいくリンク */}
      <path d="M104 62 q28 -22 56 -6" stroke={BLUE} strokeWidth="4" strokeDasharray="7 7" fill="none" strokeLinecap="round" />
      <path d="M156 48l10 8-10 8" stroke={BLUE} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Face x={138} y={98} c="#64748B" />
      <Face x={176} y={98} c="#64748B" />
      {/* QR */}
      <g transform="translate(150 16)">
        <rect width="46" height="46" rx="6" fill="#fff" stroke="#94A3B8" strokeWidth="2.5" />
        <rect x="8" y="8" width="12" height="12" fill={BLUE} />
        <rect x="26" y="8" width="12" height="12" fill={BLUE} />
        <rect x="8" y="26" width="12" height="12" fill={BLUE} />
        <rect x="28" y="28" width="8" height="8" fill={BLUE} />
      </g>
    </svg>
  )
}

function PanelFour() {
  const rows = [
    { paid: true, w: 52 },
    { paid: true, w: 40 },
    { paid: false, w: 46 },
  ]
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" role="img" aria-hidden="true">
      <rect x="30" y="16" width="160" height="118" rx="12" fill="#fff" stroke="#94A3B8" strokeWidth="3" />
      {rows.map((r, i) => (
        <g key={i} transform={`translate(46 ${34 + i * 32})`}>
          <circle cx="10" cy="10" r="10" fill={r.paid ? BLUE : '#E2E8F0'} />
          {r.paid && (
            <path d="M5 10l3.5 4L16 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <rect x="28" y="4" width={r.w} height="12" rx="6" fill="#E2E8F0" />
          <rect x={28 + r.w + 8} y="4" width="26" height="12" rx="6" fill={r.paid ? '#BFDBFE' : '#F1F5F9'} />
        </g>
      ))}
    </svg>
  )
}

const PANELS = [PanelOne, PanelTwo, PanelThree, PanelFour]

export default function SplitBillPage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーロー */}
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0B5BD3 55%, #083C8C 100%)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/splitbill/icon-512.png" alt="SplitBill" className="h-16 sm:h-20 w-auto rounded-2xl shadow-xl bg-white/10" />
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">SplitBill</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow">{c.tagline}</h1>
          <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto mb-8 leading-relaxed">{c.lead}</p>
          <a href={APP_URL} className="inline-block bg-white text-[#0B5BD3] font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
            {c.cta}
          </a>
          <p className="mt-3 text-sm text-white/85">{c.ctaNote}</p>
        </div>
      </section>

      {/* 困りごと */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.painTitle}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {c.pains.map((p, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 border-l-4 border-red-400 flex items-start gap-3">
              <span className="text-2xl leading-none">{p.icon}</span>
              <p className="text-gray-700 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4コマ */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">{c.comicTitle}</h2>
          <p className="text-center text-gray-500 mt-2 mb-10">{c.comicNote}</p>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.panels.map((p, i) => {
              const Art = PANELS[i]
              return (
                <li key={i} className="rounded-2xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
                  <div className="bg-white px-4 pt-4 pb-2">
                    <Art />
                  </div>
                  <div className="px-5 py-4 border-t-2 border-gray-200 flex-1">
                    <p className="font-bold text-gray-900 mb-1" style={{ color: BLUE }}>{p.cap}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{p.line}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="text-center mt-10">
            <a href={APP_URL} className="inline-block font-bold px-8 py-3 rounded-full shadow-lg text-white transition-opacity hover:opacity-90" style={{ background: BLUE }}>
              {c.cta}
            </a>
          </div>
        </div>
      </section>

      {/* できること */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.featTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.feats.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* お金まわりの正直な話 */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.safeTitle}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {c.safes.map((s, i) => (
              <div key={i} className="rounded-xl border-2 border-gray-200 p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AIに任せる (MCP) */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-4xl mb-3">🤖</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{c.mcpTitle}</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">{c.mcpLead}</p>
          </div>

          <ol className="grid gap-5 md:grid-cols-3 mb-8">
            {c.mcpSteps.map((s, i) => (
              <li key={i} className="rounded-xl border-2 border-gray-200 p-5">
                <p className="font-bold mb-1" style={{ color: BLUE }}>{s.head}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>

          <pre className="overflow-x-auto rounded-xl bg-gray-900 text-gray-100 text-xs sm:text-sm p-4 mb-8">
            <code>{c.mcpCode}</code>
          </pre>

          <h3 className="font-bold text-gray-900 mb-3">{c.mcpToolsTitle}</h3>
          <ul className="grid gap-3 sm:grid-cols-3 mb-8">
            {c.mcpTools.map((tool, i) => (
              <li key={i} className="rounded-xl bg-gray-50 p-4">
                <p className="font-bold text-sm text-gray-900 mb-1">{tool.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tool.desc}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 mb-8">
            <p className="text-sm text-red-800 leading-relaxed">⚠ {c.mcpWarn}</p>
          </div>

          <div className="text-center">
            <a href={MCP_URL} className="inline-block font-bold px-8 py-3 rounded-full shadow-lg text-white transition-opacity hover:opacity-90" style={{ background: BLUE }}>
              {c.mcpCta}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">{c.faqTitle}</h2>
        <div className="space-y-3">
          {c.faqs.map((f, i) => (
            <details key={i} className="bg-white rounded-xl shadow p-5 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-start gap-2">
                <span style={{ color: BLUE }}>Q.</span>
                <span className="flex-1">{f.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 最後の一押し */}
      <section className="text-white" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0B5BD3 100%)` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.lastTitle}</h2>
          <p className="text-white/90 mb-8">{c.lastDesc}</p>
          <a href={APP_URL} className="inline-block bg-white text-[#0B5BD3] font-bold px-10 py-4 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
            {c.cta}
          </a>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <a href={TERMS_URL} className="text-white/85 underline underline-offset-4 hover:text-white">{c.terms}</a>
            <Link href="/contact" className="text-white/85 underline underline-offset-4 hover:text-white">Jittee Pte. Ltd.</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
