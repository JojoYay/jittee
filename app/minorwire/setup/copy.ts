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

export type WireGuardPlatformGuide = {
  id: string
  title: string
  installUrl: string
  installLabel: string
  steps: string[]
  image: string
  imageAlt: string
}

export type SetupCopy = {
  badge: string
  title: string
  intro: string
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
  instanceName: string
  working: string
  lastUpdated: (isoOrLocal: string) => string
  recentSteps: string
  retryHint: string
  doneNote: string
  recreateCta: string
  recreateBusy: string
  recreateFailed: string
  confTitle: (name: string) => string
  downloadConf: (name: string) => string
  addPeerTitle: string
  addPeerPlaceholder: string
  addPeerBusy: string
  addPeerSubmit: string
  wgConnectTitle: string
  wgConnectIntro: string
  wgHubUrl: string
  wgHubLabel: string
  wgDownloadStepTitle: string
  wgDownloadStepBody: string
  wgDownloadStepImage: string
  wgDownloadStepImageAlt: string
  wgPlatforms: WireGuardPlatformGuide[]
  wgActivateTitle: string
  wgActivateBody: string
  wgActivateSteps: string[]
  wgActivateImage: string
  wgActivateImageAlt: string
  missingSession: string
  paymentUnverified: string
  verifyFailed: string
  failedStart: string
  networkError: string
  failedPeer: string
  supportUpsellPrompt: string
  supportUpsellTitle: string
  supportUpsellBody: string
  supportUpsellCta: string
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
    flowTitle: '全体の流れ',
    flowSteps: [
      '作りたいリージョンをホームリージョンにして Oracle Cloud アカウントを作成する',
      '管理者のまま API キーを作り、Configuration file preview を Copy、.pem を保存',
      '下に .pem をアップロードし、Copy 内容を貼って「VPN を作成」',
      '成功後、.conf を WireGuard に入れて動作確認',
      '最後に Pay As You Go へアップグレードする（カード登録・有料化しないと、アイドル整理でサーバーが削除されることがあります）',
    ],
    guideTitle: '手順ガイド',
    guideIntro:
      'スクショを見ながら進めてください。すでにアカウントがある場合は Step 1–2 を飛ばし、Step 3（API キー）からで構いません。Pay As You Go へのアップグレードは最後の Step です。',
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
        title: 'Step 2 — ホームリージョンを選ぶ',
        body:
          'Cloud Account Name のあと Home Region を選びます。後から変更できません。Always Free の Micro はホームリージョンにしか作れないので、VPN を置きたい場所を選んでください。下の選択も同じリージョンにしてください。',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'apiKey',
        title: 'Step 3 — API キーを作り、Copy して貼る',
        body:
          '下のリンクで Tokens and keys を開き、スクショと同じ操作で進めます。先に「Download private key」で .pem を保存し、Add のあと Configuration file preview で Copy した全文を貼ります。入力欄もその順（.pem → Copy 内容 → 端末名）です。登録した API キーは再作成用に暗号化して保管します。鍵は安全に管理し、コンソールで削除しないでください（削除すると再作成できず、Jittee は責任を負いません）。',
        clickSteps: [
          'Tokens and keys ページを開く（下のリンク）',
          'API keys セクションの「Add API key」をクリック',
          '「Generate API key pair」が選ばれていることを確認',
          '「Download private key」をクリックして .pem を保存（二度と表示されません）',
          '右下の「Add」をクリック（秘密鍵ダウンロード後に有効になります）',
          '下の「API 秘密鍵」に、保存した .pem をアップロード',
          '「Configuration file preview」で右下の「Copy」をクリックし、下の欄に貼り付け',
          'VPN 端末名を入れて「VPN を作成」',
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
        title: 'Step 4 — 成功後: Compute でインスタンスを確認',
        body:
          '「VPN を作成」が成功すると、あなたのテナンシー上に Always Free Micro（VM.Standard.E2.1.Micro）のコンピュート・インスタンスが1台できます。MinorWire が作る名前は minorwire- で始まります（下のスクショは Instances 画面の見本です）。セットアップ画面に公開 IP も表示されます。インスタンスを Stop または Terminate すると VPN に接続できなくなります。誤って削除した場合、再作成は登録済み API キーが有効なときだけ可能です。',
        clickSteps: [
          'セットアップ画面の状態が done になり、公開 IP と .conf が表示されることを確認',
          'コンソール左上メニュー（≡）→ Compute → Instances（または下の直リンク）',
          'リージョンが VPN 作成時と同じ（例: Japan East / Tokyo）であることを確認',
          '一覧で State が Running、Shape が VM.Standard.E2.1.Micro、Public IP がセットアップ画面と一致することを確認（MinorWire 作成時は名前が minorwire-…）',
          '表示された .conf を公式 WireGuard アプリにインポートして接続',
          'OCI コンソールでインスタンスを Stop / Terminate しない（接続不能になります）',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — Running (Always Free)',
        ociLink: 'computeInstances',
        linkLabel: 'Instances 一覧を開く',
      },
      {
        id: 'upgrade',
        title: 'Step 5 — Pay As You Go（有料アカウント）へアップグレード',
        body:
          'メニューは Billing & Cost Management → Billing → Upgrade and Manage Payment です（下の直リンクでも開けます）。Pay As You Go → Individual → Upgrade。Always Free のリソースは引き続き無料です。カード未登録・アップグレード未実施のままでも当面動くことがありますが、アイドル整理でサーバーが削除されることがあります。容量確保のためこの手順を推奨します。反映に1〜2日かかることがあります。アップグレード時、カードに USD $100 の与信枠の確保が発生します。これは実課金ではなく、確認後に取り消されます。成功すると Plan type が Pay As You Go と表示されます。',
        clickSteps: [
          'コンソール左上メニュー（≡）→ Billing & Cost Management',
          'Billing → Upgrade and Manage Payment（または下の直リンク）',
          'Pay As You Go を選び、Account type は Individual',
          'Upgrade を実行（USD $100 の与信枠の確保が発生します。後で取消）',
          '完了後、Plan type が Pay As You Go になっていることを確認',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: 'Upgrade and Manage Payment を開く',
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
    instanceName: 'インスタンス名',
    working: '作業中… 数分かかることがあります。',
    lastUpdated: (t) => `最終更新: ${t}`,
    recentSteps: '進捗ログ',
    retryHint: '失敗したため、下のフォームから同じ購入でもう一度実行できます。',
    doneNote:
      'この購入での OCI サーバは1台までです。端末用 .conf はこのページの下（テキスト／ダウンロード）から取得・追加できます。OCI Console の Compute → Instances でも同名インスタンスを確認できます。インスタンスを Stop / Terminate すると接続不能になります。誤削除時の再作成は、初回登録の API キーが有効な場合のみ可能です（キー削除時は責任を負いません）。動作確認後に Pay As You Go へアップグレードしてください（未実施だとアイドル整理で消えることがあります）。',
    recreateCta: '登録キーで VPN を再作成',
    recreateBusy: '再作成を開始中…',
    recreateFailed: '再作成に失敗しました',
    confTitle: (name) => `WireGuard 設定 (${name})`,
    downloadConf: (name) => `${name}.conf をダウンロード`,
    addPeerTitle: '別端末の .conf を追加',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: '追加中…',
    addPeerSubmit: '端末設定を作成',
    wgConnectTitle: 'WireGuard の入れ方と .conf のインポート',
    wgConnectIntro:
      '公式 WireGuard アプリを入れ、上でダウンロードした .conf をインポートしてトンネルをオンにします。OS ごとに手順はほぼ同じです。',
    wgHubUrl: 'https://www.wireguard.com/install/',
    wgHubLabel: '公式インストール一覧（wireguard.com）',
    wgDownloadStepTitle: '共通 — まず .conf をダウンロード',
    wgDownloadStepBody:
      'このページの「.conf をダウンロード」を押し、ファイルを端末に保存します（例: phone.conf）。次にそのファイルを WireGuard アプリへ取り込みます。',
    wgDownloadStepImage: '/minorwire/guide/wg-01-download-conf.png',
    wgDownloadStepImageAlt: 'Download WireGuard .conf from MinorWire',
    wgPlatforms: [
      {
        id: 'windows',
        title: 'Windows',
        installUrl: 'https://download.wireguard.com/windows-client/wireguard-installer.exe',
        installLabel: 'Windows インストーラをダウンロード',
        steps: [
          '公式 WireGuard をインストールして起動する',
          '「トンネルをインポート」（Import tunnel(s) from file）を選ぶ',
          'ダウンロードした .conf を選択する',
          '一覧のトンネルを選び「有効化」（Activate）する',
        ],
        image: '/minorwire/guide/wg-02-windows-import.png',
        imageAlt: 'WireGuard Windows import tunnel',
      },
      {
        id: 'mac',
        title: 'Mac',
        installUrl: 'https://apps.apple.com/app/wireguard/id1451685025',
        installLabel: 'Mac App Store で WireGuard を開く',
        steps: [
          'Mac App Store から WireGuard をインストールする',
          '「トンネルをインポート」（Import tunnel(s) from file）を選ぶ',
          'ダウンロードした .conf を選ぶ（Finder からドラッグでも可）',
          'トンネルをオンにし、VPN 構成の追加を許可する',
        ],
        image: '/minorwire/guide/wg-03-mac-import.png',
        imageAlt: 'WireGuard macOS import tunnel',
      },
      {
        id: 'ios',
        title: 'iPhone / iPad',
        installUrl: 'https://apps.apple.com/app/wireguard/id1441195209',
        installLabel: 'App Store で WireGuard を開く',
        steps: [
          'App Store から WireGuard をインストールする',
          '右上の「+」→「ファイルまたはアーカイブから作成」',
          'Files アプリなどに保存した .conf を選ぶ（AirDrop でも可）',
          'トグルをオンにし、VPN 構成の追加を許可する',
        ],
        image: '/minorwire/guide/wg-04-ios-import.png',
        imageAlt: 'WireGuard iOS import from file',
      },
      {
        id: 'android',
        title: 'Android',
        installUrl: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
        installLabel: 'Google Play で WireGuard を開く',
        steps: [
          'Google Play から WireGuard をインストールする',
          '右下の「+」→「ファイルまたはアーカイブからインポート」',
          'ダウンロードした .conf を選ぶ',
          'トンネルのスイッチをオンにし、VPN 接続を許可する',
        ],
        image: '/minorwire/guide/wg-05-android-import.png',
        imageAlt: 'WireGuard Android import from file',
      },
    ],
    wgActivateTitle: '共通 — トンネルをオンにする',
    wgActivateBody:
      'インポート後、トンネル名の横のスイッチ／Activate をオンにします。ブラウザで「自分の IP」を検索し、このページに表示された公開 IP になっていれば接続成功です。',
    wgActivateSteps: [
      'WireGuard アプリで対象トンネルをオン（Active）にする',
      '初回は OS の VPN 許可ダイアログで許可する',
      '公開 IP がこのページの値と一致するか確認する',
      '切るときは同じスイッチをオフにする',
    ],
    wgActivateImage: '/minorwire/guide/wg-06-activate.png',
    wgActivateImageAlt: 'Turn on WireGuard tunnel',
    missingSession: 'session_id がありません。先に PayNow で支払いを完了してください。',
    paymentUnverified: '支払いを確認できません',
    verifyFailed: '支払い確認に失敗しました',
    failedStart: '開始に失敗しました',
    networkError: 'ネットワークエラー',
    failedPeer: '端末設定の追加に失敗しました',
    supportUpsellPrompt: 'これは、お困りではないですか？',
    supportUpsellTitle: 'サポートを購入（S$100）',
    supportUpsellBody:
      '自分で進めていて行き詰まったとき用です。画面共有で一緒に設定します。',
    supportUpsellCta: 'サポートを購入 S$100（PayNow）',
  },

  en: {
    badge: 'MinorWire setup',
    title: 'Simple setup (admin API key)',
    intro:
      'We create one VPN server (WireGuard) on the cloud account you provide (Oracle Cloud). Register an admin API key and everything is created automatically.',
    flowTitle: 'Overall flow',
    flowSteps: [
      'Create an Oracle Cloud account whose home region is where you want the VPN',
      'Create an admin API key, Copy the Configuration file preview, and save the .pem',
      'Paste the Copy text below after uploading the .pem, then create the VPN',
      'After success, import the .conf into WireGuard and verify it works',
      'Finally upgrade to Pay As You Go (without a paid plan / card upgrade, idle cleanup may delete the server)',
    ],
    guideTitle: 'Step-by-step guide',
    guideIntro:
      'Follow the screenshots in order. If you already have an account, skip Steps 1–2 and start at Step 3 (API key). Upgrade to Pay As You Go is the last step.',
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
        title: 'Step 2 — Choose Home Region',
        body:
          'After Cloud Account Name, pick Home Region. You cannot change it later. Always Free Micro only works in the home region, so choose where you want the VPN. English UI defaults to Singapore — select the same region below.',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'apiKey',
        title: 'Step 3 — Create an API key, Copy, and paste',
        body:
          'Open Tokens and keys with the link below and follow the screenshots. First download the .pem (Download private key), then after Add click Copy on Configuration file preview and paste it. The form fields follow that order (.pem → Copy text → device name). We store the registered API key encrypted for recreate. Keep it secure and do not delete it in the console — if you delete it, recreation is impossible and Jittee accepts no liability.',
        clickSteps: [
          'Open the Tokens and keys page (link below)',
          'In API keys, click Add API key',
          'Confirm Generate API key pair is selected',
          'Click Download private key and save the .pem (it will not be shown again)',
          'Click Add at the bottom right (enabled after downloading the private key)',
          'Upload the saved .pem in the API private key field below',
          'On Configuration file preview, click Copy at the bottom right and paste into the field below',
          'Enter a VPN device name, then Create VPN',
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
        title: 'Step 4 — After success: confirm the instance in Compute',
        body:
          'When Create VPN succeeds, one Always Free Micro instance (VM.Standard.E2.1.Micro) is created in your tenancy. MinorWire names it starting with minorwire- (the screenshot below is an Instances page example). The setup page also shows the public IP. If you Stop or Terminate the instance, the VPN becomes unreachable. If you delete it by mistake, recreation is possible only while the registered API key remains valid.',
        clickSteps: [
          'Confirm the setup status is done and the public IP plus .conf are shown',
          'Console menu (≡) → Compute → Instances (or the direct link below)',
          'Confirm the region matches the one used for VPN creation (e.g. Singapore)',
          'In the list, confirm State is Running, Shape is VM.Standard.E2.1.Micro, and Public IP matches the setup page (MinorWire names start with minorwire-…)',
          'Import the .conf into the official WireGuard app and connect',
          'Do not Stop or Terminate the instance in the OCI console (it will become unreachable)',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — Running (Always Free)',
        ociLink: 'computeInstances',
        linkLabel: 'Open Instances list',
      },
      {
        id: 'upgrade',
        title: 'Step 5 — Upgrade to Pay As You Go',
        body:
          'Menu path: Billing & Cost Management → Billing → Upgrade and Manage Payment (or use the direct link below). Choose Pay As You Go → Individual → Upgrade. Always Free resources stay free. It may keep working without upgrade for a while, but idle cleanup can delete the server if you stay on unpaid / free-only status. Upgrade can take 1–2 days. During upgrade, a USD $100 authorization hold occurs on your card. This is not a charge and is reversed after verification. When done, Plan type shows Pay As You Go.',
        clickSteps: [
          'Open the console hamburger (≡) → Billing & Cost Management',
          'Billing → Upgrade and Manage Payment (or the direct link below)',
          'Select Pay As You Go, Account type Individual',
          'Click Upgrade (a USD $100 authorization hold will occur; it is reversed later)',
          'Confirm Plan type is Pay As You Go',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: 'Open Upgrade and Manage Payment',
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
    instanceName: 'Instance name',
    working: 'Working… this can take a few minutes.',
    lastUpdated: (t) => `Last updated: ${t}`,
    recentSteps: 'Progress log',
    retryHint: 'This run failed. You can submit the form again for the same purchase.',
    doneNote:
      'This purchase includes one OCI server. Get or add device .conf files below on this page (textarea / download). You can also confirm the same instance under Compute → Instances. Stopping or terminating the instance makes the VPN unreachable. Recreation after accidental deletion uses only the API key registered at first setup; if you delete that key, Jittee accepts no liability. After it works, upgrade to Pay As You Go — without upgrade, idle cleanup may delete the server.',
    recreateCta: 'Recreate VPN with registered key',
    recreateBusy: 'Starting recreate…',
    recreateFailed: 'Recreate failed',
    confTitle: (name) => `WireGuard config (${name})`,
    downloadConf: (name) => `Download ${name}.conf`,
    addPeerTitle: 'Add another device .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: 'Adding…',
    addPeerSubmit: 'Create device config',
    wgConnectTitle: 'Install WireGuard and import the .conf',
    wgConnectIntro:
      'Install the official WireGuard app, import the .conf you downloaded above, then turn the tunnel on. Steps are similar on every OS.',
    wgHubUrl: 'https://www.wireguard.com/install/',
    wgHubLabel: 'Official install hub (wireguard.com)',
    wgDownloadStepTitle: 'Shared — download the .conf first',
    wgDownloadStepBody:
      'Tap Download .conf on this page and save the file on your device (e.g. phone.conf). Then import that file into the WireGuard app.',
    wgDownloadStepImage: '/minorwire/guide/wg-01-download-conf.png',
    wgDownloadStepImageAlt: 'Download WireGuard .conf from MinorWire',
    wgPlatforms: [
      {
        id: 'windows',
        title: 'Windows',
        installUrl: 'https://download.wireguard.com/windows-client/wireguard-installer.exe',
        installLabel: 'Download Windows installer',
        steps: [
          'Install and open official WireGuard',
          'Choose Import tunnel(s) from file',
          'Select the downloaded .conf',
          'Select the tunnel and click Activate',
        ],
        image: '/minorwire/guide/wg-02-windows-import.png',
        imageAlt: 'WireGuard Windows import tunnel',
      },
      {
        id: 'mac',
        title: 'Mac',
        installUrl: 'https://apps.apple.com/app/wireguard/id1451685025',
        installLabel: 'Open WireGuard on the Mac App Store',
        steps: [
          'Install WireGuard from the Mac App Store',
          'Choose Import tunnel(s) from file',
          'Pick the .conf (or drag it from Finder)',
          'Turn the tunnel on and allow adding a VPN configuration',
        ],
        image: '/minorwire/guide/wg-03-mac-import.png',
        imageAlt: 'WireGuard macOS import tunnel',
      },
      {
        id: 'ios',
        title: 'iPhone / iPad',
        installUrl: 'https://apps.apple.com/app/wireguard/id1441195209',
        installLabel: 'Open WireGuard on the App Store',
        steps: [
          'Install WireGuard from the App Store',
          'Tap + → Create from file or archive',
          'Choose the .conf from Files (AirDrop also works)',
          'Toggle on and allow adding a VPN configuration',
        ],
        image: '/minorwire/guide/wg-04-ios-import.png',
        imageAlt: 'WireGuard iOS import from file',
      },
      {
        id: 'android',
        title: 'Android',
        installUrl: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
        installLabel: 'Open WireGuard on Google Play',
        steps: [
          'Install WireGuard from Google Play',
          'Tap + → Create from file or archive',
          'Select the downloaded .conf',
          'Turn the tunnel switch on and allow the VPN connection',
        ],
        image: '/minorwire/guide/wg-05-android-import.png',
        imageAlt: 'WireGuard Android import from file',
      },
    ],
    wgActivateTitle: 'Shared — turn the tunnel on',
    wgActivateBody:
      'After import, turn on the switch / Activate next to the tunnel name. Search “what is my IP” in a browser — if it matches the public IP on this page, you are connected.',
    wgActivateSteps: [
      'Turn the tunnel Active / On in WireGuard',
      'Allow the OS VPN permission prompt on first use',
      'Confirm your public IP matches this page',
      'Turn the same switch off to disconnect',
    ],
    wgActivateImage: '/minorwire/guide/wg-06-activate.png',
    wgActivateImageAlt: 'Turn on WireGuard tunnel',
    missingSession: 'Missing session_id. Complete PayNow payment first.',
    paymentUnverified: 'Could not verify payment',
    verifyFailed: 'Payment verification failed',
    failedStart: 'Failed to start',
    networkError: 'Network error',
    failedPeer: 'Failed to add device config',
    supportUpsellPrompt: 'Having trouble with this?',
    supportUpsellTitle: 'Buy support (S$100)',
    supportUpsellBody: 'If you get stuck on DIY, buy live screen-share help.',
    supportUpsellCta: 'Buy support S$100 (PayNow)',
  },

  zh: {
    badge: 'MinorWire 设置',
    title: '简易设置（管理员 API 密钥）',
    intro:
      '我们会在你准备的云账号（Oracle Cloud）上创建一台 VPN 服务器（WireGuard）。只需登记管理员 API 密钥，其余全部自动完成。',
    flowTitle: '整体流程',
    flowSteps: [
      '用目标区域作为 Home Region 创建 Oracle Cloud 账号',
      '用管理员创建 API 密钥，Copy Configuration file preview，并保存 .pem',
      '先上传 .pem，再粘贴 Copy 内容，然后创建 VPN',
      '成功后把 .conf 导入 WireGuard 并验证可用',
      '最后升级到 Pay As You Go（未付费升级时，闲置清理可能删除服务器）',
    ],
    guideTitle: '分步指南',
    guideIntro:
      '对照截图操作。若已有账号，可跳过 Step 1–2，从 Step 3（API 密钥）开始。Pay As You Go 升级是最后一步。',
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
        title: 'Step 2 — 选择 Home Region',
        body:
          '填写 Cloud Account Name 后选择 Home Region，之后无法更改。Always Free Micro 只能建在 Home Region，因此请选你想放 VPN 的地方。中文界面默认为 Singapore；请在下方选择同一区域。',
        image: '/minorwire/guide/signup-02-home-region.png',
        imageAlt: 'Home Region selection',
        fields: ['region'],
      },
      {
        id: 'apiKey',
        title: 'Step 3 — 创建 API 密钥，Copy 后粘贴',
        body:
          '用下方链接打开 Tokens and keys，按截图操作。先点击 Download private key 保存 .pem，Add 之后在 Configuration file preview 点 Copy 并粘贴。下方输入栏也是该顺序（.pem → Copy 全文 → 设备名）。登记的 API 密钥会加密保存以便重建。请妥善保管，勿在控制台删除——删除后无法重建，Jittee 不承担责任。',
        clickSteps: [
          '打开 Tokens and keys 页面（下方链接）',
          '在 API keys 区域点击 Add API key',
          '确认已选中 Generate API key pair',
          '点击 Download private key 并保存 .pem（不会再次显示）',
          '点击右下角 Add（下载私钥后才会可用）',
          '在下方「API 私钥」上传刚保存的 .pem',
          '在 Configuration file preview 右下角点击 Copy，并粘贴到下方输入框',
          '输入 VPN 设备名后点击创建 VPN',
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
        title: 'Step 4 — 成功后：在 Compute 确认实例',
        body:
          '「创建 VPN」成功后，会在你的租户中创建一台 Always Free Micro（VM.Standard.E2.1.Micro）计算实例。MinorWire 创建的名称以 minorwire- 开头（下方截图为 Instances 页面示例）。设置页也会显示公网 IP。若 Stop 或 Terminate 实例，将无法连接 VPN。误删时，仅在登记的 API 密钥仍有效时可重建。',
        clickSteps: [
          '确认设置页状态为 done，并显示公网 IP 与 .conf',
          '控制台左上菜单（≡）→ Compute → Instances（或下方直链）',
          '确认区域与创建 VPN 时一致（例如 Singapore）',
          '列表中确认 State 为 Running、Shape 为 VM.Standard.E2.1.Micro、Public IP 与设置页一致（MinorWire 创建时名称以 minorwire-… 开头）',
          '将 .conf 导入官方 WireGuard 应用并连接',
          '不要在 OCI 控制台 Stop / Terminate 实例（会导致无法连接）',
        ],
        image: '/minorwire/guide/verify-01-instances.png',
        imageAlt: 'Compute → Instances — Running (Always Free)',
        ociLink: 'computeInstances',
        linkLabel: '打开 Instances 列表',
      },
      {
        id: 'upgrade',
        title: 'Step 5 — 升级到 Pay As You Go',
        body:
          '菜单路径：Billing & Cost Management → Billing → Upgrade and Manage Payment（也可用下方直链）。选择 Pay As You Go → Individual → Upgrade。Always Free 资源仍免费。未升级时短期内可能仍能用，但闲置清理可能删除服务器。升级可能需要 1–2 天。升级时会发生 USD $100 的额度预授权（占用额度）。这不是实际扣款，验证后会撤销。完成后 Plan type 会显示为 Pay As You Go。',
        clickSteps: [
          '打开控制台左上菜单（≡）→ Billing & Cost Management',
          'Billing → Upgrade and Manage Payment（或使用下方直链）',
          '选择 Pay As You Go，Account type 选 Individual',
          '点击 Upgrade（会发生 USD $100 的额度预授权，之后会撤销）',
          '确认 Plan type 为 Pay As You Go',
        ],
        image: '/minorwire/guide/signup-04-upgrade-payg.png',
        imageAlt: 'Billing & Cost Management > Billing > Upgrade and Manage Payment',
        ociLink: 'billingUpgrade',
        linkLabel: '打开 Upgrade and Manage Payment',
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
    instanceName: '实例名称',
    working: '处理中… 可能需要几分钟。',
    lastUpdated: (t) => `最后更新: ${t}`,
    recentSteps: '进度日志',
    retryHint: '本次失败。可对同一笔购买再次提交下方表单。',
    doneNote:
      '本次购买仅包含一台 OCI 服务器。设备 .conf 可在本页下方（文本框／下载）获取或追加。也可在 Compute → Instances 确认同名实例。Stop / Terminate 实例会导致无法连接。误删后重建仅可使用首次登记的 API 密钥；若删除该密钥，Jittee 不承担责任。确认可用后请升级到 Pay As You Go——未升级时闲置清理可能删除服务器。',
    recreateCta: '用登记密钥重建 VPN',
    recreateBusy: '正在开始重建…',
    recreateFailed: '重建失败',
    confTitle: (name) => `WireGuard 配置 (${name})`,
    downloadConf: (name) => `下载 ${name}.conf`,
    addPeerTitle: '追加其他设备 .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: '添加中…',
    addPeerSubmit: '创建设备配置',
    wgConnectTitle: '安装 WireGuard 并导入 .conf',
    wgConnectIntro:
      '安装官方 WireGuard 应用，导入上方下载的 .conf，然后打开隧道。各系统步骤基本相同。',
    wgHubUrl: 'https://www.wireguard.com/install/',
    wgHubLabel: '官方安装页面（wireguard.com）',
    wgDownloadStepTitle: '通用 — 先下载 .conf',
    wgDownloadStepBody:
      '在本页点击「下载 .conf」并保存到设备（例如 phone.conf），再把该文件导入 WireGuard 应用。',
    wgDownloadStepImage: '/minorwire/guide/wg-01-download-conf.png',
    wgDownloadStepImageAlt: '从 MinorWire 下载 WireGuard .conf',
    wgPlatforms: [
      {
        id: 'windows',
        title: 'Windows',
        installUrl: 'https://download.wireguard.com/windows-client/wireguard-installer.exe',
        installLabel: '下载 Windows 安装包',
        steps: [
          '安装并打开官方 WireGuard',
          '选择「从文件导入隧道」（Import tunnel(s) from file）',
          '选择刚下载的 .conf',
          '选中隧道并点击 Activate / 启用',
        ],
        image: '/minorwire/guide/wg-02-windows-import.png',
        imageAlt: 'WireGuard Windows 导入隧道',
      },
      {
        id: 'mac',
        title: 'Mac',
        installUrl: 'https://apps.apple.com/app/wireguard/id1451685025',
        installLabel: '在 Mac App Store 打开 WireGuard',
        steps: [
          '从 Mac App Store 安装 WireGuard',
          '选择 Import tunnel(s) from file',
          '选择 .conf（也可从 Finder 拖入）',
          '打开隧道并允许添加 VPN 配置',
        ],
        image: '/minorwire/guide/wg-03-mac-import.png',
        imageAlt: 'WireGuard macOS 导入隧道',
      },
      {
        id: 'ios',
        title: 'iPhone / iPad',
        installUrl: 'https://apps.apple.com/app/wireguard/id1441195209',
        installLabel: '在 App Store 打开 WireGuard',
        steps: [
          '从 App Store 安装 WireGuard',
          '点右上角 + → Create from file or archive',
          '从“文件”选择 .conf（也可用 AirDrop）',
          '打开开关并允许添加 VPN 配置',
        ],
        image: '/minorwire/guide/wg-04-ios-import.png',
        imageAlt: 'WireGuard iOS 从文件导入',
      },
      {
        id: 'android',
        title: 'Android',
        installUrl: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
        installLabel: '在 Google Play 打开 WireGuard',
        steps: [
          '从 Google Play 安装 WireGuard',
          '点右下角 + → Create from file or archive',
          '选择下载的 .conf',
          '打开隧道开关并允许 VPN 连接',
        ],
        image: '/minorwire/guide/wg-05-android-import.png',
        imageAlt: 'WireGuard Android 从文件导入',
      },
    ],
    wgActivateTitle: '通用 — 打开隧道',
    wgActivateBody:
      '导入后打开隧道旁的开关 / Activate。在浏览器搜索“我的 IP”，若与本页公网 IP 一致，即表示已连接。',
    wgActivateSteps: [
      '在 WireGuard 中将隧道设为 Active / On',
      '首次使用时允许系统的 VPN 权限提示',
      '确认公网 IP 与本页一致',
      '断开时关闭同一开关',
    ],
    wgActivateImage: '/minorwire/guide/wg-06-activate.png',
    wgActivateImageAlt: '打开 WireGuard 隧道',
    missingSession: '缺少 session_id。请先完成 PayNow 付款。',
    paymentUnverified: '无法确认付款',
    verifyFailed: '付款确认失败',
    failedStart: '启动失败',
    networkError: '网络错误',
    failedPeer: '追加设备配置失败',
    supportUpsellPrompt: '这一步卡住了吗？',
    supportUpsellTitle: '购买支持（S$100）',
    supportUpsellBody: '自助过程中卡住时，可购买远程协助。',
    supportUpsellCta: '购买支持 S$100（PayNow）',
  },
}
