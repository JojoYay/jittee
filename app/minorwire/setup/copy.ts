import type { GuideOciLinkKey } from './ociLinks'

export type SetupFieldKey = 'region' | 'ociConfig' | 'peerName'

export type SetupFieldCopy = {
  key: SetupFieldKey
  label: string
  placeholder: string
  where: string
  ociLink?: GuideOciLinkKey
  urlLabel?: string
  required?: boolean
}

export type GuideImageCopy = {
  src: string
  alt: string
  caption?: string
}

export type GuideStepCopy = {
  id: string
  title: string
  body: string
  /** Ordered click-by-click instructions shown under the body. */
  clickSteps?: string[]
  image: string
  imageAlt: string
  /** Extra screenshots after the primary image (e.g. API key wizard). */
  images?: GuideImageCopy[]
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
  pemFileReady: (name: string) => string
  pemFileInvalid: string
  pemFileClear: string
  ociConfigOk: string
  ociConfigInvalid: string
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
  ociConfig: 'authTokens' as const,
}

export const SETUP_COPY: Record<string, SetupCopy> = {
  ja: {
    badge: 'MinorWire セットアップ',
    title: 'かんたんセットアップ（管理者キー）',
    intro:
      'あなたが用意する Cloud (Oracle Cloud) 上に VPN サーバー (WireGuard) を1台作ります。管理者アカウントの API キーを登録するだけですべて自動で作成します。',
    needsTitle: '最初に必要なもの',
    needsItems: [
      'Oracle Cloud アカウント（VPN を置きたいリージョンをホームリージョンにして作成。日本語UIの推奨は Japan East / Tokyo）',
      'Pay As You Go（有料プラン）へのアップグレード（Always Free の枠を安定して使うため。枠内は課金されません。アップグレード時に約 USD $100 のオーソリがかかり、後で取り消されます）',
      '管理者ユーザーの API キー（Configuration file preview の Copy 内容 + 秘密鍵 .pem）。IAM 設定は不要',
    ],
    flowTitle: '全体の流れ',
    flowSteps: [
      '作りたいリージョンをホームリージョンにして Oracle Cloud アカウントを作成する（推奨: 東京）',
      'Pay As You Go にアップグレードする',
      '管理者のまま API キーを作り、Configuration file preview を Copy、.pem を保存',
      '下に Copy 内容を貼り、.pem をアップロードして「VPN を作成」',
      '成功後、Compute → Instances で minorwire-* が Running か確認し、.conf を WireGuard アプリに入れる',
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
          'メニューは Billing & Cost Management → Billing → Upgrade and Manage Payment です（下の直リンクでも開けます）。Pay As You Go → Individual → Upgrade。Always Free のリソースは引き続き無料です。容量確保のためこの手順を推奨します。反映に1〜2日かかることがあります。アップグレード時、カードに約 USD $100 のオーソリ（与信枠の確保）がかかることがあります。これは実課金ではなく、確認後に取り消されます。成功すると Plan type が Pay As You Go と表示されます。',
        clickSteps: [
          'コンソール左上メニュー（≡）→ Billing & Cost Management',
          'Billing → Upgrade and Manage Payment（または下の直リンク）',
          'Pay As You Go を選び、Account type は Individual',
          'Upgrade を実行（約 USD $100 のオーソリがかかることがあります。後で取消）',
          '完了後、Plan type が Pay As You Go になっていることを確認',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: 'Upgrade and Manage Payment を開く',
      },
      {
        id: 'apiKey',
        title: 'Step 5 — API キーを作り、Copy して貼る',
        body:
          '下のリンクで Tokens and keys を開き、スクショと同じ操作で進めます。秘密鍵 (.pem) は一度しかダウンロードできません。Configuration file preview では右下の Copy を押し、出てきたテキストをそのまま下に貼るだけで、user / fingerprint / tenancy / region が揃います。',
        clickSteps: [
          'Tokens and keys ページを開く（下のリンク）',
          'API keys セクションの「Add API key」をクリック',
          '「Generate API key pair」が選ばれていることを確認',
          '「Download private key」をクリックして .pem を保存（二度と表示されません）',
          '右下の「Add」をクリック（秘密鍵ダウンロード後に有効になります）',
          '「Configuration file preview」で右下の「Copy」をクリック',
          '下の欄に貼り付け（[DEFAULT] / user= / fingerprint= / tenancy= / region= がまとめて入ります）',
          '保存した .pem をアップロードし、VPN 端末名を入れて「VPN を作成」',
        ],
        image: '/minorwire/guide/api-01-tokens-and-keys.png',
        imageAlt: 'Tokens and keys — Add API key',
        images: [
          {
            src: '/minorwire/guide/api-01-tokens-and-keys.png',
            alt: 'Tokens and keys page',
            caption: '1. Tokens and keys → Add API key',
          },
          {
            src: '/minorwire/guide/api-02-add-api-key.png',
            alt: 'Add API key dialog',
            caption: '2. Generate → Download private key → Add',
          },
          {
            src: '/minorwire/guide/api-03-config-preview.png',
            alt: 'Configuration file preview — Copy',
            caption: '3. Configuration file preview → 右下の Copy（値はぼかし済み）',
          },
        ],
        ociLink: 'authTokens',
        linkLabel: 'Tokens and keys を開く',
        fields: ['ociConfig', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
      {
        id: 'verifyInstance',
        title: 'Step 6 — 成功後: Compute でインスタンスを確認',
        body:
          '「VPN を作成」が成功すると、あなたのテナンシー上に Always Free Micro（VM.Standard.E2.1.Micro）のコンピュート・インスタンスが1台できます。名前は minorwire- で始まります。セットアップ画面に公開 IP も表示されます。コンソールでも次の手順で確認できます。',
        clickSteps: [
          'セットアップ画面の状態が done になり、公開 IP と .conf が表示されることを確認',
          'コンソール左上メニュー（≡）→ Compute → Instances（または下の直リンク）',
          'リージョンが VPN 作成時と同じ（例: Japan East / Tokyo）であることを確認',
          '一覧に minorwire-… があり、State が Running、Shape が VM.Standard.E2.1.Micro、Public IP がセットアップ画面と一致することを確認',
          '表示された .conf を公式 WireGuard アプリにインポートして接続',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — minorwire instance Running',
        ociLink: 'computeInstances',
        linkLabel: 'Instances 一覧を開く',
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
          'サインアップ時の Home Region と同じものを選んでください。日本語UIの初期値は Tokyo。Always Free Micro はホームリージョンのみ。Configuration file preview を貼ると region= で上書きされます。',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'ociConfig',
        label: 'Configuration file preview（Copy した全文）',
        placeholder: '[DEFAULT]\nuser=ocid1.user.oc1..\nfingerprint=aa:bb:...\ntenancy=ocid1.tenancy.oc1..\nregion=ap-tokyo-1\nkey_file=...',
        where:
          'OCI の Configuration file preview で Copy したテキストをそのまま貼り付けてください。user / fingerprint / tenancy / region を自動で読み取ります（Compartment は tenancy= を自動使用）。',
        ociLink: fieldUrls.ociConfig,
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
    pemLabel: 'API 秘密鍵（.pem ファイル）',
    pemWhere:
      'Download private key で保存した .pem をそのままアップロードしてください（開いて貼る必要はありません）。例: you@example.com-2026-09-10T02_05_19.736Z.pem',
    pemUrlLabel: 'Tokens and keys',
    pemFileReady: (name) => `選択中: ${name}`,
    pemFileInvalid: '有効な .pem 秘密鍵ファイルを選んでください（PRIVATE KEY を含むこと）。',
    pemFileClear: 'ファイルをクリア',
    ociConfigOk: 'Configuration を読み取りました（user / fingerprint / tenancy / region）。',
    ociConfigInvalid:
      'Configuration file preview の全文を貼り付けてください（user= / fingerprint= / tenancy= / region= が必要です）。',
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
      'この購入での OCI サーバは1台までです。端末用 .conf は下からいつでも追加できます。インスタンスは Compute → Instances で minorwire-* / Running を確認できます。',
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
      'We create one VPN server (WireGuard) on the cloud account you provide (Oracle Cloud). Register an admin API key and everything is created automatically.',
    needsTitle: 'What you need first',
    needsItems: [
      'An Oracle Cloud account with Home Region set to where you want the VPN (English UI default: Singapore)',
      'Upgrade to Pay As You Go (keeps Always Free resources free; improves capacity reliability. Upgrade may place an ~USD $100 authorization hold that is later reversed)',
      'An admin API key (Configuration file preview Copy text + private key .pem). No IAM setup required',
    ],
    flowTitle: 'Overall flow',
    flowSteps: [
      'Create an Oracle Cloud account whose home region is where you want the VPN (recommended: Singapore)',
      'Upgrade to Pay As You Go',
      'Create an admin API key, Copy the Configuration file preview, and save the .pem',
      'Paste the Copy text below, upload the .pem, and create the VPN',
      'After success, confirm minorwire-* is Running under Compute → Instances, then import the .conf into WireGuard',
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
          'Menu path: Billing & Cost Management → Billing → Upgrade and Manage Payment (or use the direct link below). Choose Pay As You Go → Individual → Upgrade. Always Free resources stay free. Upgrade can take 1–2 days. During upgrade, Oracle may place an authorization hold of about USD $100 on your card. This is not a charge and is reversed after verification. When done, Plan type shows Pay As You Go.',
        clickSteps: [
          'Open the console hamburger (≡) → Billing & Cost Management',
          'Billing → Upgrade and Manage Payment (or the direct link below)',
          'Select Pay As You Go, Account type Individual',
          'Click Upgrade (about USD $100 authorization may appear; it is reversed later)',
          'Confirm Plan type is Pay As You Go',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: 'Open Upgrade and Manage Payment',
      },
      {
        id: 'apiKey',
        title: 'Step 5 — Create an API key, Copy, and paste',
        body:
          'Open Tokens and keys with the link below and follow the screenshots. The private key (.pem) can be downloaded only once. On Configuration file preview, click Copy at the bottom right and paste the whole text below — that fills user / fingerprint / tenancy / region.',
        clickSteps: [
          'Open the Tokens and keys page (link below)',
          'In API keys, click Add API key',
          'Confirm Generate API key pair is selected',
          'Click Download private key and save the .pem (it will not be shown again)',
          'Click Add at the bottom right (enabled after downloading the private key)',
          'On Configuration file preview, click Copy at the bottom right',
          'Paste into the field below ([DEFAULT] / user= / fingerprint= / tenancy= / region= all at once)',
          'Upload the saved .pem, enter a VPN device name, then Create VPN',
        ],
        image: '/minorwire/guide/api-01-tokens-and-keys.png',
        imageAlt: 'Tokens and keys — Add API key',
        images: [
          {
            src: '/minorwire/guide/api-01-tokens-and-keys.png',
            alt: 'Tokens and keys page',
            caption: '1. Tokens and keys → Add API key',
          },
          {
            src: '/minorwire/guide/api-02-add-api-key.png',
            alt: 'Add API key dialog',
            caption: '2. Generate → Download private key → Add',
          },
          {
            src: '/minorwire/guide/api-03-config-preview.png',
            alt: 'Configuration file preview — Copy',
            caption: '3. Configuration file preview → Copy (bottom right; values blurred)',
          },
        ],
        ociLink: 'authTokens',
        linkLabel: 'Open Tokens and keys',
        fields: ['ociConfig', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
      {
        id: 'verifyInstance',
        title: 'Step 6 — After success: confirm the instance in Compute',
        body:
          'When Create VPN succeeds, one Always Free Micro instance (VM.Standard.E2.1.Micro) is created in your tenancy. The name starts with minorwire-. The setup page also shows the public IP. You can double-check in the console as follows.',
        clickSteps: [
          'Confirm the setup status is done and the public IP plus .conf are shown',
          'Console menu (≡) → Compute → Instances (or the direct link below)',
          'Confirm the region matches the one used for VPN creation (e.g. Singapore)',
          'In the list, find minorwire-… with State Running, Shape VM.Standard.E2.1.Micro, and Public IP matching the setup page',
          'Import the .conf into the official WireGuard app and connect',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — minorwire instance Running',
        ociLink: 'computeInstances',
        linkLabel: 'Open Instances list',
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
          'Must match Home Region from signup. English UI defaults to Singapore. Always Free Micro is home-region only. Pasting Configuration file preview overwrites this from region=.',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'ociConfig',
        label: 'Configuration file preview (full Copy text)',
        placeholder: '[DEFAULT]\nuser=ocid1.user.oc1..\nfingerprint=aa:bb:...\ntenancy=ocid1.tenancy.oc1..\nregion=ap-singapore-1\nkey_file=...',
        where:
          'Paste the text from OCI Configuration file preview Copy as-is. We read user / fingerprint / tenancy / region automatically (compartment = tenancy).',
        ociLink: fieldUrls.ociConfig,
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
    pemLabel: 'API private key (.pem file)',
    pemWhere:
      'Upload the .pem saved from Download private key as-is (no need to open and paste). Example: you@example.com-2026-09-10T02_05_19.736Z.pem',
    pemUrlLabel: 'Tokens and keys',
    pemFileReady: (name) => `Selected: ${name}`,
    pemFileInvalid: 'Choose a valid .pem private key file (must contain PRIVATE KEY).',
    pemFileClear: 'Clear file',
    ociConfigOk: 'Configuration parsed (user / fingerprint / tenancy / region).',
    ociConfigInvalid:
      'Paste the full Configuration file preview text (needs user= / fingerprint= / tenancy= / region=).',
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
      'This purchase includes one OCI server. You can add more device .conf files below anytime. Confirm the instance under Compute → Instances as minorwire-* / Running.',
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
      '我们会在你准备的云账号（Oracle Cloud）上创建一台 VPN 服务器（WireGuard）。只需登记管理员 API 密钥，其余全部自动完成。',
    needsTitle: '首先需要准备',
    needsItems: [
      'Oracle Cloud 账号（Home Region 选你想放 VPN 的区域；中文界面默认推荐 Singapore）',
      '升级到 Pay As You Go（Always Free 资源仍免费，便于稳定拿到容量。升级时可能出现约 USD $100 预授权，随后会撤销）',
      '管理员 API 密钥（Configuration file preview 的 Copy 全文 + 私钥 .pem）。无需 IAM 配置',
    ],
    flowTitle: '整体流程',
    flowSteps: [
      '用目标区域作为 Home Region 创建 Oracle Cloud 账号（推荐：Singapore）',
      '升级到 Pay As You Go',
      '用管理员创建 API 密钥，Copy Configuration file preview，并保存 .pem',
      '把 Copy 内容粘贴到下方、上传 .pem，然后创建 VPN',
      '成功后在 Compute → Instances 确认 minorwire-* 为 Running，再把 .conf 导入 WireGuard',
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
          '菜单路径：Billing & Cost Management → Billing → Upgrade and Manage Payment（也可用下方直链）。选择 Pay As You Go → Individual → Upgrade。Always Free 资源仍免费。升级可能需要 1–2 天。升级时卡片上可能出现约 USD $100 的预授权（占用额度），这不是实际扣款，验证后会撤销。完成后 Plan type 会显示为 Pay As You Go。',
        clickSteps: [
          '打开控制台左上菜单（≡）→ Billing & Cost Management',
          'Billing → Upgrade and Manage Payment（或使用下方直链）',
          '选择 Pay As You Go，Account type 选 Individual',
          '点击 Upgrade（可能出现约 USD $100 预授权，之后会撤销）',
          '确认 Plan type 为 Pay As You Go',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: '打开 Upgrade and Manage Payment',
      },
      {
        id: 'apiKey',
        title: 'Step 5 — 创建 API 密钥，Copy 后粘贴',
        body:
          '用下方链接打开 Tokens and keys，按截图操作。私钥（.pem）只能下载一次。在 Configuration file preview 右下角点 Copy，把全文粘贴到下方即可自动填入 user / fingerprint / tenancy / region。',
        clickSteps: [
          '打开 Tokens and keys 页面（下方链接）',
          '在 API keys 区域点击 Add API key',
          '确认已选中 Generate API key pair',
          '点击 Download private key 并保存 .pem（不会再次显示）',
          '点击右下角 Add（下载私钥后才会可用）',
          '在 Configuration file preview 右下角点击 Copy',
          '粘贴到下方输入框（[DEFAULT] / user= / fingerprint= / tenancy= / region= 一次到位）',
          '上传保存的 .pem，输入 VPN 设备名后点击创建 VPN',
        ],
        image: '/minorwire/guide/api-01-tokens-and-keys.png',
        imageAlt: 'Tokens and keys — Add API key',
        images: [
          {
            src: '/minorwire/guide/api-01-tokens-and-keys.png',
            alt: 'Tokens and keys page',
            caption: '1. Tokens and keys → Add API key',
          },
          {
            src: '/minorwire/guide/api-02-add-api-key.png',
            alt: 'Add API key dialog',
            caption: '2. Generate → Download private key → Add',
          },
          {
            src: '/minorwire/guide/api-03-config-preview.png',
            alt: 'Configuration file preview — Copy',
            caption: '3. Configuration file preview → 右下角 Copy（已模糊）',
          },
        ],
        ociLink: 'authTokens',
        linkLabel: '打开 Tokens and keys',
        fields: ['ociConfig', 'peerName'],
        showPem: true,
        showSubmit: true,
      },
      {
        id: 'verifyInstance',
        title: 'Step 6 — 成功后：在 Compute 确认实例',
        body:
          '「创建 VPN」成功后，会在你的租户中创建一台 Always Free Micro（VM.Standard.E2.1.Micro）计算实例。名称以 minorwire- 开头。设置页也会显示公网 IP。也可按以下步骤在控制台核对。',
        clickSteps: [
          '确认设置页状态为 done，并显示公网 IP 与 .conf',
          '控制台左上菜单（≡）→ Compute → Instances（或下方直链）',
          '确认区域与创建 VPN 时一致（例如 Singapore）',
          '列表中找到 minorwire-…，State 为 Running，Shape 为 VM.Standard.E2.1.Micro，Public IP 与设置页一致',
          '将 .conf 导入官方 WireGuard 应用并连接',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — minorwire instance Running',
        ociLink: 'computeInstances',
        linkLabel: '打开 Instances 列表',
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
          '须与注册时的 Home Region 一致。中文界面默认 Singapore。Always Free Micro 仅限 Home Region。粘贴 Configuration file preview 后会用 region= 覆盖。',
        ociLink: fieldUrls.region,
        urlLabel: 'Tenancy Details',
      },
      {
        key: 'ociConfig',
        label: 'Configuration file preview（Copy 的全文）',
        placeholder: '[DEFAULT]\nuser=ocid1.user.oc1..\nfingerprint=aa:bb:...\ntenancy=ocid1.tenancy.oc1..\nregion=ap-singapore-1\nkey_file=...',
        where:
          '把 OCI Configuration file preview 中 Copy 的文本原样粘贴。我们会自动读取 user / fingerprint / tenancy / region（compartment = tenancy）。',
        ociLink: fieldUrls.ociConfig,
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
    pemLabel: 'API 私钥（.pem 文件）',
    pemWhere:
      '直接上传 Download private key 保存的 .pem（无需打开粘贴）。例如: you@example.com-2026-09-10T02_05_19.736Z.pem',
    pemUrlLabel: 'Tokens and keys',
    pemFileReady: (name) => `已选择: ${name}`,
    pemFileInvalid: '请选择有效的 .pem 私钥文件（须包含 PRIVATE KEY）。',
    pemFileClear: '清除文件',
    ociConfigOk: '已读取 Configuration（user / fingerprint / tenancy / region）。',
    ociConfigInvalid:
      '请粘贴 Configuration file preview 全文（需要 user= / fingerprint= / tenancy= / region=）。',
    submitBusy: '启动中…',
    submit: '创建 VPN',
    verifying: '正在确认付款…',
    cannotStart: '无法开始设置',
    back: '返回 MinorWire',
    purchase: '购买',
    status: '状态',
    publicIp: '公网 IP',
    working: '处理中… 可能需要几分钟。',
    doneNote: '本次购买仅包含一台 OCI 服务器。下方可随时追加设备 .conf。也可在 Compute → Instances 确认 minorwire-* / Running。',
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
