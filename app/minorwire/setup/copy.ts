import type { GuideOciLinkKey } from './ociLinks'

export type SetupFieldKey =
  | 'region'
  | 'tenancyOcid'
  | 'userOcid'
  | 'fingerprint'
  | 'peerName'

export type SetupFieldCopy = {
  key: SetupFieldKey
  label: string
  placeholder: string
  where: string
  ociLink?: GuideOciLinkKey
  urlLabel?: string
  required?: boolean
}

export type GuideStepCopy = {
  id: string
  title: string
  body: string
  image: string
  imageAlt: string
  link?: string
  /** Resolved with the region currently selected in the form. */
  ociLink?: GuideOciLinkKey
  linkLabel?: string
  /** Form fields shown directly under this step. */
  fields?: SetupFieldKey[]
  showPem?: boolean
  showSubmit?: boolean
}



export type SetupCopy = {
  badge: string
  title: string
  intro: string
  needsTitle: string
  needsItems: string[]
  flowTitle: string
  flowSteps: string[]
  guideTitle: string
  guideIntro: string
  guideSteps: GuideStepCopy[]
  formTitle: string
  formIntro: string
  fields: SetupFieldCopy[]
  pemLabel: string
  pemWhere: string
  pemUrlLabel: string
  submitBusy: string
  submit: string
  verifying: string
  cannotStart: string
  back: string
  purchase: string
  status: string
  publicIp: string
  working: string
  doneNote: string
  confTitle: (name: string) => string
  downloadConf: (name: string) => string
  addPeerTitle: string
  addPeerPlaceholder: string
  addPeerBusy: string
  addPeerSubmit: string
  missingSession: string
  paymentUnverified: string
  verifyFailed: string
  failedStart: string
  networkError: string
  failedPeer: string
}

const fieldUrls = {
  region: 'tenancy' as const,
  tenancyOcid: 'tenancy' as const,
  userOcid: 'myProfile' as const,
  fingerprint: 'myProfile' as const,
}

export const SETUP_COPY: Record<string, SetupCopy> = {
  ja: {
    badge: 'MinorWire セットアップ',
    title: 'かんたんセットアップ（管理者キー）',
    intro:
      'あなたの Oracle Cloud 上に WireGuard を1台作ります。IAM ポリシーや専用ユーザーは不要です。管理者アカウントの API キーだけで進めます。',
    needsTitle: '最初に必要なもの',
    needsItems: [
      'Oracle Cloud アカウント（VPN を置きたいリージョンをホームリージョンにして作成。日本語UIの推奨は Japan East / Tokyo）',
      'Pay As You Go（有料プラン）へのアップグレード（Always Free の枠を安定して使うため。枠内は課金されません。アップグレード時に約 USD $100 のオーソリがかかり、後で取り消されます）',
      '管理者ユーザーの API キー（User OCID + Fingerprint + PEM）。IAM 設定は不要',
    ],
    flowTitle: '全体の流れ',
    flowSteps: [
      '作りたいリージョンをホームリージョンにして Oracle Cloud アカウントを作成する（推奨: 東京）',
      'Pay As You Go にアップグレードする',
      '管理者のまま API キーを作り、Tenancy OCID を控える',
      '下のフォームで同じリージョンを選び、値を貼って「VPN を作成」',
      '表示された .conf を公式 WireGuard アプリに入れる',
    ],
    guideTitle: '手順ガイド（上から順に）',
    guideIntro:
      'スクショを見ながら進めてください。すでにアカウントがある場合は Step 1–2 を飛ばし、Step 3 からで構いません。',
    guideSteps: [
      {
        id: 'signup',
        title: 'Step 1 — Oracle Cloud アカウントを作成',
        body:
          'サインアップページで国・氏名・メールを入力し、メール認証を完了します。1人1アカウントです。',
        image: '/minorwire/guide/signup-01-start.png',
        imageAlt: 'Oracle Cloud Free Tier signup',
        ociLink: 'signup',
        linkLabel: 'サインアップを開く',
      },
      {
        id: 'homeRegion',
        title: 'Step 2 — ホームリージョンを選ぶ（推奨: Japan East / Tokyo）',
        body:
          'Cloud Account Name のあと Home Region を選びます。後から変更できません。Always Free の Micro はホームリージョンにしか作れないので、VPN を置きたい場所を選んでください。日本語向けの推奨は Japan East (Tokyo) です。下の選択も同じリージョンにしてください。',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'payment',
        title: 'Step 3 — カードで本人確認（サインアップ時）',
        body:
          'クレジットカードで支払い方法を登録します。無料枠の確認用の一時的な与信が付くことがあります。Always Free の範囲では課金されません。',
        image: '/minorwire/guide/signup-03-payment.png',
        imageAlt: 'Payment verification',
        ociLink: 'signupDocs',
        linkLabel: '公式サインアップ手順',
      },
      {
        id: 'upgrade',
        title: 'Step 4 — Pay As You Go（有料アカウント）へアップグレード',
        body:
          'コンソール → Billing & Cost Management → Upgrade and Manage Payment → Pay As You Go → Individual → Upgrade。Always Free のリソースは引き続き無料です。容量確保のためこの手順を推奨します。反映に1〜2日かかることがあります。アップグレード時、カードに約 USD $100 のオーソリ（与信枠の確保）がかかることがあります。これは実課金ではなく、確認後に取り消されます。',
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Upgrade to Pay As You Go',
        ociLink: 'billingUpgrade',
        linkLabel: 'Upgrade and Manage Payment を開く',
      },
      {
        id: 'tenancy',
        title: 'Step 5 — Tenancy OCID をコピーして貼る',
        body:
          'Profile → Tenancy または Tenancy Details で OCID をコピー。Compartment は root（= Tenancy OCID）を自動使用するので、別途の IAM / Compartment 設定は不要です。下にそのまま貼ってください。',
        image: '/minorwire/guide/live-tenancy.png',
        imageAlt: 'Tenancy OCID',
        ociLink: 'tenancy',
        linkLabel: 'Tenancy Details を開く',
        fields: ['tenancyOcid'],
      },
      {
        id: 'apiKey',
        title: 'Step 6 — 管理者の API キーを作成して貼る',
        body:
          'My profile → Tokens and keys → Add API Key。表示される Fingerprint を控え、.pem を一度だけダウンロード。User OCID も同じ画面の Details からコピー。グループやポリシーは作りません。下に貼ってから VPN を作成します。',
        image: '/minorwire/guide/live-user-ocid.png',
        imageAlt: 'User OCID and API key',
        ociLink: 'myProfile',
        linkLabel: 'My profile を開く',
        fields: ['userOcid', 'fingerprint', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
    ],
    formTitle: '',
    formIntro: '',
    fields: [
      {
        key: 'region',
        label: 'VPN を作るリージョン（ホームリージョン）',
        placeholder: 'ap-tokyo-1',
        where:
          'サインアップ時の Home Region と同じものを選んでください。日本語UIの初期値は Tokyo。Always Free Micro はホームリージョンのみ。',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'tenancyOcid',
        label: 'Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: 'ocid1.tenancy.oc1.. で始まる文字列を貼ります。',
        ociLink: fieldUrls.tenancyOcid,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'userOcid',
        label: 'User OCID（管理者）',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: 'My profile の OCID。',
        ociLink: fieldUrls.userOcid,
        urlLabel: 'My profile',
      },
      {
        key: 'fingerprint',
        label: 'API Key Fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where: 'Tokens and keys に表示される指紋。',
        ociLink: fieldUrls.fingerprint,
        urlLabel: 'Tokens and keys',
      },
      {
        key: 'peerName',
        label: 'VPN 端末名',
        placeholder: 'iphone',
        where:
          'iphone, Laptop など、VPN の対象になる端末の名前を入力します（Oracle の情報ではありません）。',
        required: false,
      },
    ],
    pemLabel: 'API 秘密鍵（PEM）',
    pemWhere: 'ダウンロードした .pem を開き、BEGIN から END まで全部貼る。',
    pemUrlLabel: 'My profile',
    submitBusy: '開始中…',
    submit: 'VPN を作成',
    verifying: '支払いを確認しています…',
    cannotStart: 'セットアップを開始できません',
    back: 'MinorWire に戻る',
    purchase: '購入',
    status: '状態',
    publicIp: '公開 IP',
    working: '作業中… 数分かかることがあります。',
    doneNote:
      'この購入での OCI サーバは1台までです。端末用 .conf は下からいつでも追加できます。',
    confTitle: (name) => `WireGuard 設定 (${name})`,
    downloadConf: (name) => `${name}.conf をダウンロード`,
    addPeerTitle: '別端末の .conf を追加',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: '追加中…',
    addPeerSubmit: '端末設定を作成',
    missingSession: 'session_id がありません。先に PayNow で支払いを完了してください。',
    paymentUnverified: '支払いを確認できません',
    verifyFailed: '支払い確認に失敗しました',
    failedStart: '開始に失敗しました',
    networkError: 'ネットワークエラー',
    failedPeer: '端末設定の追加に失敗しました',
  },

  en: {
    badge: 'MinorWire setup',
    title: 'Simple setup (admin API key)',
    intro:
      'We create one WireGuard server on your Oracle Cloud tenancy. No IAM policy or dedicated user. Use your Administrators API key only.',
    needsTitle: 'What you need first',
    needsItems: [
      'An Oracle Cloud account with Home Region set to where you want the VPN (English UI default: Singapore)',
      'Upgrade to Pay As You Go (keeps Always Free resources free; improves capacity reliability. Upgrade may place an ~USD $100 authorization hold that is later reversed)',
      'An admin user API key (User OCID + Fingerprint + PEM). No IAM setup required',
    ],
    flowTitle: 'Overall flow',
    flowSteps: [
      'Create an Oracle Cloud account whose home region is where you want the VPN (recommended: Singapore)',
      'Upgrade to Pay As You Go',
      'Create an admin API key and copy the Tenancy OCID',
      'Select the same region in the form below, paste values, and create the VPN',
      'Import the .conf into the official WireGuard app',
    ],
    guideTitle: 'Step-by-step guide',
    guideIntro:
      'Follow the screenshots in order. If you already have an account, skip Steps 1–2 and start at Step 3 (or Step 4 if already verified).',
    guideSteps: [
      {
        id: 'signup',
        title: 'Step 1 — Create an Oracle Cloud account',
        body: 'On the signup page enter country, name, and email, then verify email. One account per person.',
        image: '/minorwire/guide/signup-01-start.png',
        imageAlt: 'Oracle Cloud Free Tier signup',
        ociLink: 'signup',
        linkLabel: 'Open signup',
      },
      {
        id: 'homeRegion',
        title: 'Step 2 — Choose Home Region (recommended: Singapore)',
        body:
          'After Cloud Account Name, pick Home Region. You cannot change it later. Always Free Micro only works in the home region, so choose where you want the VPN. English UI defaults to Singapore — select the same region below.',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'payment',
        title: 'Step 3 — Card verification at signup',
        body:
          'Add a credit card for identity verification. You may see a temporary authorization hold. Always Free usage is not charged.',
        image: '/minorwire/guide/signup-03-payment.png',
        imageAlt: 'Payment verification',
        ociLink: 'signupDocs',
        linkLabel: 'Official signup docs',
      },
      {
        id: 'upgrade',
        title: 'Step 4 — Upgrade to Pay As You Go',
        body:
          'Console → Billing & Cost Management → Upgrade and Manage Payment → Pay As You Go → Individual → Upgrade. Always Free resources stay free. Upgrade can take 1–2 days. During upgrade, Oracle may place an authorization hold of about USD $100 on your card. This is not a charge and is reversed after verification.',
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Upgrade to Pay As You Go',
        ociLink: 'billingUpgrade',
        linkLabel: 'Open Upgrade and Manage Payment',
      },
      {
        id: 'tenancy',
        title: 'Step 5 — Copy Tenancy OCID and paste below',
        body:
          'Profile → Tenancy / Tenancy Details → copy OCID. We use root compartment (= Tenancy OCID) automatically — no separate IAM or compartment setup. Paste it into the field under this step.',
        image: '/minorwire/guide/live-tenancy.png',
        imageAlt: 'Tenancy OCID',
        ociLink: 'tenancy',
        linkLabel: 'Open Tenancy Details',
        fields: ['tenancyOcid'],
      },
      {
        id: 'apiKey',
        title: 'Step 6 — Create an admin API key and paste below',
        body:
          'My profile → Tokens and keys → Add API Key. Save Fingerprint and download the .pem once. Copy User OCID from the same profile. Do not create groups or policies. Paste the values below, then create the VPN.',
        image: '/minorwire/guide/live-user-ocid.png',
        imageAlt: 'User OCID and API key',
        ociLink: 'myProfile',
        linkLabel: 'Open My profile',
        fields: ['userOcid', 'fingerprint', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
    ],
    formTitle: '',
    formIntro: '',
    fields: [
      {
        key: 'region',
        label: 'Region for the VPN (home region)',
        placeholder: 'ap-singapore-1',
        where:
          'Must match Home Region from signup. English UI defaults to Singapore. Always Free Micro is home-region only.',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'tenancyOcid',
        label: 'Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: 'Paste the string that starts with ocid1.tenancy.oc1..',
        ociLink: fieldUrls.tenancyOcid,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'userOcid',
        label: 'User OCID (admin)',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: 'OCID from My profile.',
        ociLink: fieldUrls.userOcid,
        urlLabel: 'My profile',
      },
      {
        key: 'fingerprint',
        label: 'API Key Fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where: 'Fingerprint shown under Tokens and keys.',
        ociLink: fieldUrls.fingerprint,
        urlLabel: 'Tokens and keys',
      },
      {
        key: 'peerName',
        label: 'VPN device name',
        placeholder: 'iphone',
        where:
          'Name of the device that will use the VPN (e.g. iphone, Laptop). This is not an Oracle value.',
        required: false,
      },
    ],
    pemLabel: 'API private key (PEM)',
    pemWhere: 'Open the downloaded .pem and paste BEGIN through END.',
    pemUrlLabel: 'My profile',
    submitBusy: 'Starting…',
    submit: 'Create VPN',
    verifying: 'Verifying payment…',
    cannotStart: 'Cannot start setup',
    back: 'Back to MinorWire',
    purchase: 'Purchase',
    status: 'Status',
    publicIp: 'Public IP',
    working: 'Working… this can take a few minutes.',
    doneNote:
      'This purchase includes one OCI server. You can add more device .conf files below anytime.',
    confTitle: (name) => `WireGuard config (${name})`,
    downloadConf: (name) => `Download ${name}.conf`,
    addPeerTitle: 'Add another device .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: 'Adding…',
    addPeerSubmit: 'Create device config',
    missingSession: 'Missing session_id. Complete PayNow payment first.',
    paymentUnverified: 'Could not verify payment',
    verifyFailed: 'Payment verification failed',
    failedStart: 'Failed to start',
    networkError: 'Network error',
    failedPeer: 'Failed to add device config',
  },

  zh: {
    badge: 'MinorWire 设置',
    title: '简易设置（管理员 API 密钥）',
    intro:
      '我们会在你的 Oracle Cloud 上创建一台 WireGuard。不需要 IAM 策略或专用用户，只用管理员 API 密钥即可。',
    needsTitle: '首先需要准备',
    needsItems: [
      'Oracle Cloud 账号（Home Region 选你想放 VPN 的区域；中文界面默认推荐 Singapore）',
      '升级到 Pay As You Go（Always Free 资源仍免费，便于稳定拿到容量。升级时可能出现约 USD $100 预授权，随后会撤销）',
      '管理员用户的 API 密钥（User OCID + Fingerprint + PEM）。无需 IAM 配置',
    ],
    flowTitle: '整体流程',
    flowSteps: [
      '用目标区域作为 Home Region 创建 Oracle Cloud 账号（推荐：Singapore）',
      '升级到 Pay As You Go',
      '用管理员创建 API 密钥并复制 Tenancy OCID',
      '在下方表单选择同一区域，粘贴并创建 VPN',
      '把 .conf 导入官方 WireGuard 应用',
    ],
    guideTitle: '分步指南（按顺序）',
    guideIntro: '对照截图操作。若已有账号，可跳过 Step 1–2，从 Step 3 或 Step 4 开始。',
    guideSteps: [
      {
        id: 'signup',
        title: 'Step 1 — 创建 Oracle Cloud 账号',
        body: '在注册页填写国家、姓名、邮箱并完成邮箱验证。每人限一个账号。',
        image: '/minorwire/guide/signup-01-start.png',
        imageAlt: 'Oracle Cloud Free Tier signup',
        ociLink: 'signup',
        linkLabel: '打开注册页',
      },
      {
        id: 'homeRegion',
        title: 'Step 2 — 选择 Home Region（推荐：Singapore）',
        body:
          '填写 Cloud Account Name 后选择 Home Region，之后无法更改。Always Free Micro 只能建在 Home Region，因此请选你想放 VPN 的地方。中文界面默认推荐 Singapore；请在下方选择同一区域。',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'payment',
        title: 'Step 3 — 注册时用信用卡验证',
        body: '添加信用卡用于身份验证，可能出现临时预授权。Always Free 范围内不收费。',
        image: '/minorwire/guide/signup-03-payment.png',
        imageAlt: 'Payment verification',
        ociLink: 'signupDocs',
        linkLabel: '官方注册文档',
      },
      {
        id: 'upgrade',
        title: 'Step 4 — 升级到 Pay As You Go',
        body:
          '控制台 → Billing & Cost Management → Upgrade and Manage Payment → Pay As You Go → Individual → Upgrade。Always Free 资源仍免费。升级可能需要 1–2 天。升级时卡片上可能出现约 USD $100 的预授权（占用额度），这不是实际扣款，验证后会撤销。',
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Upgrade to Pay As You Go',
        ociLink: 'billingUpgrade',
        linkLabel: '打开 Upgrade and Manage Payment',
      },
      {
        id: 'tenancy',
        title: 'Step 5 — 复制 Tenancy OCID 并粘贴',
        body:
          'Profile → Tenancy / Tenancy Details 复制 OCID。我们会自动使用 root（= Tenancy OCID），无需单独 IAM / Compartment。请粘贴到本步骤下方的输入框。',
        image: '/minorwire/guide/live-tenancy.png',
        imageAlt: 'Tenancy OCID',
        ociLink: 'tenancy',
        linkLabel: '打开 Tenancy Details',
        fields: ['tenancyOcid'],
      },
      {
        id: 'apiKey',
        title: 'Step 6 — 创建管理员 API 密钥并粘贴',
        body:
          'My profile → Tokens and keys → Add API Key。保存 Fingerprint 并下载一次 .pem。从同一页面复制 User OCID。不要创建组或策略。粘贴到下方后创建 VPN。',
        image: '/minorwire/guide/live-user-ocid.png',
        imageAlt: 'User OCID and API key',
        ociLink: 'myProfile',
        linkLabel: '打开 My profile',
        fields: ['userOcid', 'fingerprint', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
    ],
    formTitle: '',
    formIntro: '',
    fields: [
      {
        key: 'region',
        label: 'VPN 所在区域（Home Region）',
        placeholder: 'ap-singapore-1',
        where:
          '须与注册时的 Home Region 一致。中文界面默认 Singapore。Always Free Micro 仅限 Home Region。',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'tenancyOcid',
        label: 'Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: '粘贴以 ocid1.tenancy.oc1.. 开头的字符串。',
        ociLink: fieldUrls.tenancyOcid,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'userOcid',
        label: 'User OCID（管理员）',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: '来自 My profile 的 OCID。',
        ociLink: fieldUrls.userOcid,
        urlLabel: 'My profile',
      },
      {
        key: 'fingerprint',
        label: 'API Key Fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where: 'Tokens and keys 中显示的指纹。',
        ociLink: fieldUrls.fingerprint,
        urlLabel: 'Tokens and keys',
      },
      {
        key: 'peerName',
        label: 'VPN 设备名',
        placeholder: 'iphone',
        where: '输入将使用 VPN 的设备名称（如 iphone、Laptop）。不是 Oracle 中的信息。',
        required: false,
      },
    ],
    pemLabel: 'API 私钥（PEM）',
    pemWhere: '打开下载的 .pem，从 BEGIN 到 END 全部粘贴。',
    pemUrlLabel: 'My profile',
    submitBusy: '启动中…',
    submit: '创建 VPN',
    verifying: '正在确认付款…',
    cannotStart: '无法开始设置',
    back: '返回 MinorWire',
    purchase: '购买',
    status: '状态',
    publicIp: '公网 IP',
    working: '处理中… 可能需要几分钟。',
    doneNote: '本次购买仅包含一台 OCI 服务器。下方可随时追加设备 .conf。',
    confTitle: (name) => `WireGuard 配置 (${name})`,
    downloadConf: (name) => `下载 ${name}.conf`,
    addPeerTitle: '追加其他设备 .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: '添加中…',
    addPeerSubmit: '创建设备配置',
    missingSession: '缺少 session_id。请先完成 PayNow 付款。',
    paymentUnverified: '无法确认付款',
    verifyFailed: '付款确认失败',
    failedStart: '启动失败',
    networkError: '网络错误',
    failedPeer: '追加设备配置失败',
  },
}
