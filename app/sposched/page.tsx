'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ImageModal from '../components/ImageModal'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * SpoSched (スポスケ) 紹介ページ — 1ページ・3言語 (ja/en/zh)。
 * コピーはこのページ内に閉じて持つ (locale で出し分け)。サイト共通の
 * LanguageSwitcher(Navbar) で言語が切り替わる。実スクショは public/sposched/。
 */

// Cloudflare Turnstile (無料の人間判定)。サイトキーは公開情報。
// 空文字の間はウィジェットを出さず、サーバー側の検証もスキップされる (段階導入)
const TURNSTILE_SITE_KEY = '0x4AAAAAAD8rM9xgBtGkDMYZ'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile?: any
  }
}

interface Feature {
  title: string
  desc: string
  bullets: string[]
  shots: { src: string; label: string }[]
  comingSoon?: string // 近日提供バッジ (スクショ無しの装飾表示)
}
interface Copy {
  heroTagline: string
  heroDesc: string
  ctaPrimary: string
  problemsTitle: string
  problem1Title: string; problem1Desc: string
  problem2Title: string; problem2Desc: string
  solutionTitle: string; solutionDesc: string
  featuresTitle: string
  features: Feature[]
  // AI 統合 (新機能)
  aiBadge: string
  aiTitle: string
  aiDesc: string
  aiBullets: string[]
  aiExamples: { user: string; ai: string }[]
  aiNote: string
  pricingTitle: string
  pricingFreeBadge: string
  pricingDesc: string
  pricingNote: string
  proofTitle: string; proofDesc: string
  ctaTitle: string; ctaDesc: string; ctaButton: string
  helpLink: string
  trialTitle: string; trialDesc: string
  trialName: string; trialEmail: string; trialContact: string
  trialSubmit: string; trialSending: string
  trialDone: string; trialFail: string
}

const COPY: Record<string, Copy> = {
  ja: {
    heroTagline: 'スポーツ団体の運営を、もっとシンプルに。',
    heroDesc: '出欠の確認から集金・会計まで。チーム運営の“面倒”を、ひとつのアプリに。',
    ctaPrimary: '1か月無料ではじめる',
    problemsTitle: 'スポーツ団体の運営、こんな悩みはありませんか？',
    problem1Title: '出欠確認が煩雑',
    problem1Desc: '「次はいつ・どこで、誰が来る？何人？」の確認が毎回大変。連絡がバラバラで、集計もひと苦労。',
    problem2Title: '会計・清算が煩雑',
    problem2Desc: '参加費の集金、誰が払った／未払い、団体に残っているお金…。手作業の管理は、手間もミスも増えがち。',
    solutionTitle: 'SpoSched なら、これらがまとめて解決',
    solutionDesc: '出欠・清算・会計・連絡を、ひとつの流れで。運営の手間を大きく減らします。',
    featuresTitle: 'できること',
    features: [
      {
        title: 'スケジュール & 出欠',
        desc: 'イベントを“いつ・どこで”登録。今“何人参加予定か”が一目で分かります。',
        bullets: ['カレンダーで開催日・場所を共有', '〇△×で出欠回答、参加人数を自動集計', '定員・残席もひと目で把握'],
        shots: [{ src: '/sposched/calendar.png', label: 'カレンダー' }, { src: '/sposched/calendar2.png', label: '出欠一覧' }],
      },
      {
        title: '清算',
        desc: '参加費や月々の月謝などの清算をサポート。“誰がいくら払う？”“支払い済み？”がすぐ分かります。',
        bullets: ['イベントごとの都度払いから、毎月の月謝・年会費まで様々な支払いパターンに対応', '支払いはPayNow。「支払った事実」を管理する方式なので手数料はゼロ', '支払い済み／未払いの管理と、支払いの催促がかんたん'],
        shots: [{ src: '/sposched/PaymentTable.png', label: '幹事の清算画面' }, { src: '/sposched/payment.png', label: 'メンバーの支払い' }],
      },
      {
        title: '会計',
        desc: '団体が“今いくらプールしているか”。残高と入出金の履歴をまとめて管理。',
        bullets: ['入金・支出を記録して残高を自動計算', '清算の入金も自動で会計に反映', '月謝の管理や、スタジオなど場所代の定期的な記帳もこちらで', '団体のプール金額がいつでも分かる'],
        shots: [{ src: '/sposched/Cashbook.png', label: '会計（台帳）' }, { src: '/sposched/account2.png', label: '記帳' }],
      },
      {
        title: 'LINE連携 & リマインド',
        desc: '未払いの催促や、参加の告知がかんたん。LINE公式アカウントと連携できます。',
        bullets: ['公式アカウントを友だち追加するだけで登録完了', '未払いの催促・イベント告知をLINEでプッシュ', 'リッチメニューからアプリへすぐアクセス'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE設定' }, { src: '/sposched/LineLogin.png', label: 'LINEログイン' }],
      },
      {
        title: 'チーム分け & フォーメーション',
        desc: '参加者をチームに分けて、フォーメーションまで決められます。紅白戦の組み分けから、対戦相手がいる試合の並びまで。',
        bullets: [
          'チーム数を選んで「自動配置」を押すだけ。幹事をばらけさせる・子供を含めるなどの条件を選べます（実力で均す条件は、実力をプロフィール項目に持たせている団体で出ます）',
          'フォーメーションは名前を付けて何枚でも保存。前半・後半で丸ごと入れ替える形もそのまま残せます',
          'AIと連動。ポジションや経験年数などをプロフィール項目として自由に設定しておけば、それに沿った分け方をAIに頼めます',
        ],
        shots: [{ src: '/sposched/Team2.png', label: 'チーム分け' }, { src: '/sposched/Team.png', label: 'フォーメーション' }],
      },
      {
        title: 'AIマネージャー',
        desc: 'アプリの中にマネージャーがいます。メニューを探さず、話しかけるだけで調べたり動かしたりできます。',
        bullets: [
          '「今週末は何人来る？」「未払いの人は？」——聞けばその場で答えます',
          '「プロフィールの希望ポジションを見て、今のチームを振り分けて」——調べるだけでなく、そのまま実行までできます',
          '開いている画面を踏まえて答えます。カレンダーを見ていればその日のことを話します',
          '次にやることを提案します。イベントが無ければ「作りましょう」と声をかけます',
        ],
        shots: [{ src: '/sposched/AIManager1.png', label: 'AIマネージャー' }, { src: '/sposched/AIManager2.png', label: '画面を見ながら相談' }],
      },
      {
        title: 'SpotMyShot連携（メディアストレージ）',
        desc: '写真共有サービス SpotMyShot との連携で、イベントの写真・動画をみんなでアップロードして共有できます。',
        bullets: ['イベントごとのアルバムを自動作成、メンバー全員がアップロード可能', '画像の劣化なくアップロード（原本のまま保存・ダウンロード）', '100GBまで無料。リンクを知っていれば誰でも閲覧・ダウンロード'],
        shots: [{ src: '/sposched/media.png', label: '写真・動画ページ' }, { src: '/sposched/media2.png', label: 'チームアルバム' }],
      },
    ],
    aiBadge: '新機能',
    aiTitle: '話しかけるだけ。あとはAIにおまかせ。',
    aiDesc: '出欠の登録も、イベントの作成も、メニューを探す必要はありません。SpoSched は MCP に対応。普段お使いの ChatGPT や Claude から話しかけるだけで、SpoSched を直接操作できます。',
    aiBullets: [
      '空き状況を確認して、出欠を自動で登録',
      '「いつもの条件で」——過去の設定を引き継いでイベント作成',
      '操作を覚える必要なし。使い慣れた ChatGPT / Claude から頼むだけ',
    ],
    aiExamples: [
      { user: '来週末のサッカーって参加可能かな？まだ空きがあれば出席を〇にしておいて', ai: '来週末の試合、まだ空きがありました。あなたの出欠を「〇（参加）」で登録しておきました ✅' },
      { user: '新しいイベントを水曜に行うので、ピッチAで19時から。あとはいつもの条件で作って', ai: '水曜 19:00〜 ピッチA でイベントを作成しました。定員・参加費はいつも通りの設定にしています ✅' },
    ],
    aiNote: 'お使いの ChatGPT / Claude に SpoSched（MCPサーバー）を接続すれば、すぐに使えます。',
    pricingTitle: '料金',
    pricingFreeBadge: '初回 1か月 無料',
    pricingDesc: '料金はチームの規模や利用形態に合わせてご案内しています。まずはお気軽にご連絡ください。',
    pricingNote: 'PayNow対応。まずは1か月無料でお試しください。',
    proofTitle: '導入実績',
    proofDesc: 'シンガポールのサッカーサークルを中心に、多くのチームにご利用いただいています。',
    ctaTitle: 'まずは1か月、無料で。',
    ctaDesc: '導入のご相談・お問い合わせはお気軽にどうぞ。',
    ctaButton: 'お問い合わせ',
    helpLink: '📖 使い方・初期設定ガイド',
    trialTitle: '1か月無料体験に申し込む',
    trialDesc: '登録いただいたメールアドレスに、チーム開設用のURLと説明をお送りします (30日有効)。開設から1か月間、全機能を無料でお使いいただけます。',
    trialName: 'お名前',
    trialEmail: 'メールアドレス',
    trialContact: '連絡先 (電話・LINE等)',
    trialSubmit: '無料体験を申し込む',
    trialSending: '送信中...',
    trialDone: 'お申し込みありがとうございます！開設用URLをメールでお送りしました (届かない場合は迷惑メールフォルダをご確認ください)。',
    trialFail: '送信に失敗しました。時間をおいて再度お試しいただくか、お問い合わせください。',
  },
  en: {
    heroTagline: 'Running your sports club, made simple.',
    heroDesc: 'From attendance to collecting money and accounting — put the hassle of team management into one app.',
    ctaPrimary: 'Start 1 month free',
    problemsTitle: 'Managing a sports club? Sound familiar?',
    problem1Title: 'Attendance is a hassle',
    problem1Desc: '“When, where, who’s coming, how many?” — checking every time is tiring, and tallying scattered replies is even worse.',
    problem2Title: 'Accounting & settlement is a hassle',
    problem2Desc: 'Collecting fees, who paid and who hasn’t, how much the club has left… manual tracking means more work and more mistakes.',
    solutionTitle: 'SpoSched solves all of this',
    solutionDesc: 'Attendance, settlement, accounting and announcements in one flow — dramatically less admin work.',
    featuresTitle: 'What you can do',
    features: [
      {
        title: 'Schedule & Attendance',
        desc: 'Post an event with when & where. See at a glance how many people are coming.',
        bullets: ['Share dates & venues on a shared calendar', 'RSVP with ○ △ ✕; headcount tallied automatically', 'See capacity and spots left instantly'],
        shots: [{ src: '/sposched/calendar.png', label: 'Calendar' }, { src: '/sposched/calendar2.png', label: 'Attendance list' }],
      },
      {
        title: 'Settlement',
        desc: 'Supports settling event fees and monthly dues alike — instantly see who owes what and who has paid.',
        bullets: ['Handles many payment patterns: pay-per-event, monthly dues, annual fees', 'Payments via PayNow — we track the fact of payment, so there are zero processing fees', 'Easily manage paid / unpaid and send payment reminders'],
        shots: [{ src: '/sposched/PaymentTable.png', label: 'Organizer view' }, { src: '/sposched/payment.png', label: 'Member payment' }],
      },
      {
        title: 'Accounting',
        desc: 'Know exactly how much the club has pooled — balance and full history in one place.',
        bullets: ['Record income & expenses; balance auto-calculated', 'Settlement income flows into the ledger automatically', 'Manage monthly dues and recurring costs like studio or venue rent here too', 'Always know the club’s pooled balance'],
        shots: [{ src: '/sposched/Cashbook.png', label: 'Ledger' }, { src: '/sposched/account2.png', label: 'New entry' }],
      },
      {
        title: 'LINE integration & reminders',
        desc: 'Send payment reminders and event announcements easily — connect your official LINE account.',
        bullets: ['Members register just by adding your official account', 'Push payment reminders & announcements via LINE', 'Quick access to the app from the rich menu'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE settings' }, { src: '/sposched/LineLogin.png', label: 'LINE login' }],
      },
      {
        title: 'Teams & formations',
        desc: 'Split attendees into teams and set the formation — from casual scrimmages to a lineup against a real opponent.',
        bullets: [
          'Pick the number of teams and press Auto assign. Choose the conditions: spread organizers, include kids — and balance by ability if your team keeps ability in its profile fields.',
          'Save as many named formations as you like — keep a first-half and a second-half lineup side by side.',
          'Works with the AI. Set up any profile fields you want (position, years of experience) and ask the AI to split the teams accordingly.',
        ],
        shots: [{ src: '/sposched/Team2.png', label: 'Teams' }, { src: '/sposched/Team.png', label: 'Formation' }],
      },
      {
        title: 'AI manager',
        desc: 'There is a manager inside the app. Just talk to it — no menu hunting.',
        bullets: [
          '"How many are coming this weekend?" "Who still owes money?" — ask and it answers on the spot.',
          '"Split the current teams using the preferred positions in the member profiles" — it does not just look things up, it carries the change out.',
          'It answers with the screen you are on in mind: open the calendar and it talks about that day.',
          'It suggests what to do next — with no upcoming event, it offers to create one.',
        ],
        shots: [{ src: '/sposched/AIManager1.png', label: 'AI manager' }, { src: '/sposched/AIManager2.png', label: 'Ask while you work' }],
      },
      {
        title: 'SpotMyShot integration (media storage)',
        desc: 'Upload and share event photos & videos as a team — powered by SpotMyShot, our photo-sharing service.',
        bullets: ['Albums created automatically per event; every member can upload', 'No quality loss — originals are stored and downloaded as-is', 'Up to 100GB free; anyone with the link can view & download'],
        shots: [{ src: '/sposched/media.png', label: 'Media page' }, { src: '/sposched/media2.png', label: 'Team album' }],
      },
    ],
    aiBadge: 'NEW',
    aiTitle: 'Just ask — let AI handle the rest.',
    aiDesc: 'Registering attendance or creating an event — no need to hunt through menus. SpoSched speaks MCP: connect it to the ChatGPT or Claude you already use, and just say what you want.',
    aiBullets: [
      'Checks availability and sets your RSVP automatically',
      '“Same as usual” — creates events carrying over past settings',
      'Nothing to learn — just ask from the ChatGPT or Claude you already use',
    ],
    aiExamples: [
      { user: 'Can I make it to next weekend’s game? If there’s still a spot, set my attendance to attending.', ai: 'Next weekend’s game still had spots — I’ve set your RSVP to “attending” ✅' },
      { user: 'We’ve got a new event on Wednesday — Pitch A, from 7pm, everything else as usual.', ai: 'Created an event: Wed 7:00pm at Pitch A, with your usual capacity and fee ✅' },
    ],
    aiNote: 'Connect SpoSched (MCP server) to your ChatGPT / Claude — then just ask.',
    pricingTitle: 'Pricing',
    pricingFreeBadge: 'First month free',
    pricingDesc: 'Pricing depends on your team size and how you use SpoSched. Get in touch and we will walk you through it.',
    pricingNote: 'PayNow supported. Try it free for 1 month.',
    proofTitle: 'Trusted by teams',
    proofDesc: 'Used by many teams, especially soccer circles across Singapore.',
    ctaTitle: 'Try it free for 1 month.',
    ctaDesc: 'Get in touch — we’re happy to help you get started.',
    ctaButton: 'Contact us',
    helpLink: '📖 Setup & how-to guide',
    trialTitle: 'Sign up for the 1-month free trial',
    trialDesc: 'We will email you a team-creation URL with instructions (valid 30 days). All features are free for 1 month after you create your team.',
    trialName: 'Name',
    trialEmail: 'Email address',
    trialContact: 'Contact (phone / LINE, etc.)',
    trialSubmit: 'Start free trial',
    trialSending: 'Sending...',
    trialDone: 'Thank you! We have emailed you the team-creation URL (check your spam folder if it does not arrive).',
    trialFail: 'Failed to send. Please try again later or contact us.',
  },
  zh: {
    heroTagline: '让体育团体的运营，更简单。',
    heroDesc: '从考勤到收款、记账，把团队管理的“麻烦”都装进一个应用。',
    ctaPrimary: '免费试用 3 个月',
    problemsTitle: '运营体育团体，是否也有这些烦恼？',
    problem1Title: '考勤繁琐',
    problem1Desc: '“下次几点、在哪、谁来、几个人？”每次确认都很费劲，消息零散、统计更麻烦。',
    problem2Title: '记账与结算繁琐',
    problem2Desc: '收取参加费、谁付了／谁没付、团体还剩多少钱……手工管理既费时又容易出错。',
    solutionTitle: 'SpoSched 一次帮你解决',
    solutionDesc: '考勤、结算、记账、通知，一个流程搞定，大幅减少运营负担。',
    featuresTitle: '功能一览',
    features: [
      {
        title: '日程与考勤',
        desc: '登记活动的时间与地点，一眼就能看到目前有多少人参加。',
        bullets: ['用共享日历同步日期与场地', '以 ○ △ ✕ 回答出席，自动统计人数', '名额与剩余席位一目了然'],
        shots: [{ src: '/sposched/calendar.png', label: '日历' }, { src: '/sposched/calendar2.png', label: '出席名单' }],
      },
      {
        title: '结算',
        desc: '支持活动参加费、每月月费等各类结算。谁该付多少、是否已付，一目了然。',
        bullets: ['支持多种付款模式：按次付费、每月月费、年费等', '付款使用 PayNow，采用“记录已付款事实”的方式，零手续费', '轻松管理已付/未付，并可一键催款'],
        shots: [{ src: '/sposched/PaymentTable.png', label: '干事结算界面' }, { src: '/sposched/payment.png', label: '成员付款' }],
      },
      {
        title: '记账',
        desc: '团体目前共有多少资金，余额与收支记录统一管理。',
        bullets: ['记录收入与支出，自动计算余额', '结算收入自动计入账本', '月费管理、工作室/场地租金等定期记账也在这里完成', '随时掌握团体的资金余额'],
        shots: [{ src: '/sposched/Cashbook.png', label: '账本' }, { src: '/sposched/account2.png', label: '记账' }],
      },
      {
        title: 'LINE 联动与提醒',
        desc: '轻松发送催缴与活动通知，可与 LINE 官方账号联动。',
        bullets: ['加官方账号为好友即可完成注册', '通过 LINE 推送催缴与活动通知', '从丰富菜单快速进入应用'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE 设置' }, { src: '/sposched/LineLogin.png', label: 'LINE 登录' }],
      },
      {
        title: '分队 & 阵型',
        desc: '把参加者分成队伍，还能定好阵型。从队内对抗到对外比赛的排布都可以。',
        bullets: [
          '选好队伍数量，按一下「自动分配」即可。可选条件：分散干事、包含儿童；若团体在个人资料中记录了实力，还可按实力平衡。',
          '阵型可以命名并保存任意多套，上半场与下半场的整体换人也能各自留存。',
          '与AI联动。把位置、球龄等自由设定为个人资料项目后，就可以让AI按这些条件分队。',
        ],
        shots: [{ src: '/sposched/Team2.png', label: '分队' }, { src: '/sposched/Team.png', label: '阵型' }],
      },
      {
        title: 'AI 经理',
        desc: '应用里就有一位经理。不用找菜单，直接说话就能查询和操作。',
        bullets: [
          '「这周末来几个人？」「谁还没付款？」——问了就当场回答。',
          '「参考个人资料里的意向位置，把现在的队伍重新分一下」——不只是查询，还能直接执行。',
          '会结合你正在看的画面回答。打开日历时，就聊那一天的事。',
          '会提示接下来该做什么。没有活动时，会主动提议创建。',
        ],
        shots: [{ src: '/sposched/AIManager1.png', label: 'AI 经理' }, { src: '/sposched/AIManager2.png', label: '边看边问' }],
      },
      {
        title: 'SpotMyShot 联动（媒体存储）',
        desc: '与照片共享服务 SpotMyShot 联动，活动的照片和视频可以大家一起上传、共享。',
        bullets: ['按活动自动创建相册，全体成员均可上传', '上传不压缩画质（按原图保存与下载）', '免费提供 100GB；知道链接的人即可查看与下载'],
        shots: [{ src: '/sposched/media.png', label: '照片·视频页面' }, { src: '/sposched/media2.png', label: '团队相册' }],
      },
    ],
    aiBadge: '新功能',
    aiTitle: '只需开口，其余交给 AI。',
    aiDesc: '登记出席、创建活动，都无需在菜单里翻找。SpoSched 支持 MCP：连接到你常用的 ChatGPT 或 Claude，用日常的话说出来即可。',
    aiBullets: [
      '自动查看空位并登记你的出席',
      '“照常设置”—— 沿用以往条件创建活动',
      '无需学习操作，用你常用的 ChatGPT / Claude 直接说即可',
    ],
    aiExamples: [
      { user: '下周末的比赛我能参加吗？如果还有空位，就把我的出席设为○。', ai: '下周末的比赛还有空位，已把你的出席登记为「○（参加）」✅' },
      { user: '周三有个新活动，A 场地，晚上7点开始，其余照常。', ai: '已创建活动：周三 19:00 A 场地，名额与费用沿用以往设置 ✅' },
    ],
    aiNote: '把 SpoSched（MCP 服务器）连接到你的 ChatGPT / Claude，即可开始使用。',
    pricingTitle: '价格',
    pricingFreeBadge: '前 3 个月免费',
    pricingDesc: '价格根据团队规模与使用方式提供。请先与我们联系。',
    pricingNote: '支持 PayNow。先免费试用 3 个月。',
    proofTitle: '客户实绩',
    proofDesc: '以新加坡的足球社团为主，众多团队正在使用。',
    ctaTitle: '先免费试用 3 个月。',
    ctaDesc: '欢迎咨询，我们乐意协助您快速上手。',
    ctaButton: '联系我们',
    helpLink: '📖 使用与初始设置指南',
    trialTitle: '申请 3 个月免费体验',
    trialDesc: '我们将把创建团队的 URL 和说明发送到您登记的邮箱 (30 天有效)。创建后 3 个月内可免费使用全部功能。',
    trialName: '姓名',
    trialEmail: '电子邮箱',
    trialContact: '联系方式 (电话 / LINE 等)',
    trialSubmit: '申请免费体验',
    trialSending: '发送中...',
    trialDone: '感谢您的申请！创建团队的 URL 已发送到您的邮箱 (如未收到请检查垃圾邮件)。',
    trialFail: '发送失败。请稍后重试或与我们联系。',
  },
}

/** スマホ枠つきスクショ。画像未配置でもラベル付きプレースホルダを出す */
function PhoneShot({ src, label, onOpen }: { src: string; label: string; onOpen: () => void }) {
  const [err, setErr] = useState(false)
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onOpen}
        className="rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform"
        // 狭い画面では2枚並びがはみ出さないよう縮小 (2枚 + 余白が常に収まる幅)
        style={{ width: 'min(210px, 42vw)' }}
        aria-label={label}
      >
        {err ? (
          <div className="w-full aspect-[198/430] bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center text-gray-400 text-sm">
            {label}
          </div>
        ) : (
          <img src={src} alt={label} onError={() => setErr(true)} className="block w-full h-auto" />
        )}
      </button>
      <span className="mt-3 text-xs font-semibold text-gray-500">{label}</span>
    </div>
  )
}

export default function SpoSchedPage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja
  const [modal, setModal] = useState<{ src: string; title: string } | null>(null)
  // 1か月無料体験フォーム: SpoSched本番の Edge Function trial-signup が
  // 開設チケットを発行し、申込者へ案内メール + 運営へ通知を送る
  const [trialName, setTrialName] = useState('')
  const [trialEmail, setTrialEmail] = useState('')
  const [trialContact, setTrialContact] = useState('')
  const [trialWebsite, setTrialWebsite] = useState('') // honeypot (人間は入力しない)
  const [trialState, setTrialState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [trialErrorMsg, setTrialErrorMsg] = useState('')
  // Turnstile: 判定トークン (未設定キーなら空のまま送る)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return
    const render = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current !== null) return
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
      })
    }
    if (window.turnstile) { render(); return }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = render
    document.head.appendChild(script)
  }, [])

  const submitTrial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (trialState === 'sending') return
    setTrialState('sending')
    setTrialErrorMsg('')
    try {
      const res = await fetch('https://yyeleqhfbbjnscaddutx.supabase.co/functions/v1/trial-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trialName, email: trialEmail, contact: trialContact, website: trialWebsite, turnstileToken }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setTrialErrorMsg(typeof data.error === 'string' ? data.error : '')
        setTrialState('error')
        // トークンは使い切りのため、失敗したら再判定させる
        if (TURNSTILE_SITE_KEY && window.turnstile && turnstileWidgetId.current !== null) {
          window.turnstile.reset(turnstileWidgetId.current)
          setTurnstileToken('')
        }
        return
      }
      setTrialState('done')
    } catch {
      setTrialState('error')
      if (TURNSTILE_SITE_KEY && window.turnstile && turnstileWidgetId.current !== null) {
        window.turnstile.reset(turnstileWidgetId.current)
        setTurnstileToken('')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F1A2B] via-[#1E3350] to-[#0F1A2B] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <img src="/sposched/mark.svg" alt="" aria-hidden="true"
                 className="h-16 sm:h-20 w-auto rounded-2xl shadow-xl" />
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">Spo<span className="text-white/60">Sched</span></span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow">{c.heroTagline}</h1>
          <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto mb-8">{c.heroDesc}</p>
          <a href="#trial" className="inline-block bg-[#F0B429] text-[#0F1A2B] font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#F7C64F] transition-colors">
            {c.ctaPrimary}
          </a>
          <div className="mt-4">
            <Link href="/sposched/help" className="text-sm text-white/90 underline underline-offset-4 hover:text-white">
              {c.helpLink}
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.problemsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[{ t: c.problem1Title, d: c.problem1Desc }, { t: c.problem2Title, d: c.problem2Desc }].map((p, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 border-l-4 border-red-400">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">😵‍💫</span>
                <h3 className="text-lg font-bold text-gray-900">{p.t}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution intro */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{c.solutionTitle}</h2>
          <p className="text-gray-600">{c.solutionDesc}</p>
        </div>
      </section>

      {/* AI 統合 (新機能) — チャット風モックアップ。スクショ不要で自己完結 */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-amber-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-14">
            {/* Text */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-[#1E3350] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">✨ {c.aiBadge}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{c.aiTitle}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">{c.aiDesc}</p>
              <ul className="space-y-2 mb-5">
                {c.aiBullets.map((b, j) => (
                  <li key={j} className="flex items-start text-gray-700">
                    <span className="text-[#DBA31F] mr-2 mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">{c.aiNote}</p>
            </div>
            {/* Chat mockup */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-gray-50 rounded-3xl border border-gray-200 shadow-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-200">
                  <span className="w-8 h-8 rounded-full bg-[#0F1A2B] text-white flex items-center justify-center text-base shrink-0">🤖</span>
                  <div className="leading-tight">
                    <div className="font-bold text-gray-700 text-sm">SpoSched</div>
                    <div className="text-[11px] text-gray-400">ChatGPT · Claude · MCP</div>
                  </div>
                  <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-400" aria-hidden="true" />
                </div>
                <div className="space-y-6">
                  {c.aiExamples.map((ex, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-[#1E3350] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow">{ex.user}</div>
                      </div>
                      <div className="flex justify-start items-end gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0F1A2B] text-white flex items-center justify-center text-xs shrink-0">🤖</span>
                        <div className="max-w-[85%] bg-white border border-gray-200 text-gray-700 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm shadow-sm">{ex.ai}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature sections with real screenshots (alternating) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="sr-only">{c.featuresTitle}</h2>
        <div className="space-y-16 sm:space-y-24 py-10">
          {c.features.map((f, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10`}>
              {/* Screenshots (無ければ装飾ボックス) */}
              <div className="flex justify-center gap-3 sm:gap-6 flex-1">
                {f.shots.length > 0 ? f.shots.map((s) => (
                  <PhoneShot key={s.src} src={s.src} label={s.label} onOpen={() => setModal({ src: s.src, title: s.label })} />
                )) : (
                  <div className="rounded-[2rem] bg-gradient-to-br from-slate-100 to-amber-100 shadow-inner flex flex-col items-center justify-center gap-4 px-4 aspect-[210/430]"
                    style={{ width: 'min(210px, 42vw)' }}>
                    <span className="text-5xl">📸</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/spotmyshot/spotMyShot_logo.png" alt="SpotMyShot" className="w-full h-auto" />
                    <span className="text-5xl">🎥</span>
                  </div>
                )}
              </div>
              {/* Text */}
              <div className="flex-1">
                <div className="inline-block bg-amber-100 text-[#0F1A2B] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                {f.comingSoon && (
                  <span className="ml-2 inline-block bg-[#1E3350] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {f.comingSoon}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b, j) => (
                    <li key={j} className="flex items-start text-gray-700">
                      <span className="text-[#DBA31F] mr-2 mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.pricingTitle}</h2>
          <div className="relative bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl shadow-lg p-8 text-center border border-slate-200">
            <span className="inline-block bg-[#F0B429] text-[#0F1A2B] text-sm font-bold px-4 py-1 rounded-full mb-6">🎁 {c.pricingFreeBadge}</span>
            <p className="text-lg text-gray-800 font-medium mb-6 max-w-xl mx-auto">{c.pricingDesc}</p>
            <Link href="/contact" className="inline-block bg-[#F0B429] text-[#0F1A2B] font-bold px-8 py-3 rounded-full shadow hover:bg-[#DBA31F] transition-colors mb-4">
              {c.ctaButton}
            </Link>
            <p className="text-sm text-gray-500">{c.pricingNote}</p>
          </div>
        </div>
      </section>

      {/* 1か月無料体験の申し込みフォーム */}
      <section id="trial" className="bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">{c.trialTitle}</h2>
          <p className="text-gray-600 text-center mb-8">{c.trialDesc}</p>
          {trialState === 'done' ? (
            <div className="bg-amber-50 border border-amber-200 text-[#0F1A2B] rounded-xl p-6 text-center font-medium">
              ✅ {c.trialDone}
            </div>
          ) : (
            <form onSubmit={submitTrial} className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl shadow p-6 sm:p-8 space-y-4 border border-slate-200">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{c.trialName} *</label>
                <input type="text" required maxLength={100} value={trialName}
                  onChange={e => setTrialName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{c.trialEmail} *</label>
                <input type="email" required maxLength={200} value={trialEmail}
                  onChange={e => setTrialEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{c.trialContact} *</label>
                <input type="text" required maxLength={200} value={trialContact}
                  onChange={e => setTrialContact(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
              </div>
              {/* honeypot: ボット対策の不可視フィールド */}
              <input type="text" value={trialWebsite} onChange={e => setTrialWebsite(e.target.value)}
                tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0" placeholder="website" />
              {TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex justify-center" />
              )}
              {trialState === 'error' && (
                <p className="text-sm text-red-600 font-medium">{trialErrorMsg || c.trialFail}</p>
              )}
              <button type="submit" disabled={trialState === 'sending' || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full bg-[#F0B429] text-[#0F1A2B] font-bold py-3 rounded-full shadow hover:bg-[#DBA31F] transition-colors disabled:opacity-60">
                {trialState === 'sending' ? c.trialSending : c.trialSubmit}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{c.proofTitle}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">{c.proofDesc}</p>
        <div className="flex justify-center gap-3 text-4xl opacity-90"><span>⚽</span><span>🏀</span><span>🎾</span><span>⚾</span></div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0F1A2B] to-[#1E3350] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.ctaTitle}</h2>
          <p className="text-white/95 mb-8">{c.ctaDesc}</p>
          <Link href="/contact" className="inline-block bg-[#F0B429] text-[#0F1A2B] font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#F7C64F] transition-colors">
            {c.ctaButton}
          </Link>
          <div className="mt-4">
            <Link href="/sposched/help" className="text-sm text-white/90 underline underline-offset-4 hover:text-white">
              {c.helpLink}
            </Link>
          </div>
        </div>
      </section>

      <ImageModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        imageSrc={modal?.src ?? ''}
        imageAlt={modal?.title ?? ''}
        title={modal?.title ?? ''}
      />
    </div>
  )
}
