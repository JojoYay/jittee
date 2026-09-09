import { OCI_LINKS } from './ociLinks'

export type SetupFieldKey =
  | 'region'
  | 'tenancyOcid'
  | 'compartmentOcid'
  | 'userOcid'
  | 'fingerprint'
  | 'peerName'

export type SetupFieldCopy = {
  key: SetupFieldKey
  label: string
  placeholder: string
  where: string
  url?: string
  urlLabel?: string
  required?: boolean
}

export type SetupCopy = {
  badge: string
  title: string
  intro: string
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
  targetTitle: string
  targetBody: string
  urlsTitle: string
  urlsIntro: string
  urlHome: string
  urlHomeHint: string
  urlTenancy: string
  urlTenancyHint: string
  urlCompartments: string
  urlCompartmentsHint: string
  urlDomains: string
  urlDomainsHint: string
  urlProfile: string
  urlProfileHint: string
  urlPolicies: string
  urlPoliciesHint: string
  prepareTitle: string
  prepareSteps: string[]
  figTenancy: string
  figCompartment: string
  figApiKeys: string
  policyTitle: string
  policyIntroBefore: string
  policyIntroAfter: string
  policyNameLabel: string
  policyNamePlaceholder: string
  copyPolicy: string
  copiedPolicy: string
  formTitle: string
  formIntro: string
  fields: SetupFieldCopy[]
  pemLabel: string
  pemWhere: string
  pemUrlLabel: string
  submitBusy: string
  submit: string
  missingSession: string
  paymentUnverified: string
  verifyFailed: string
  failedStart: string
  networkError: string
  failedPeer: string
}

const fieldUrls = {
  region: OCI_LINKS.tenancy,
  tenancyOcid: OCI_LINKS.tenancy,
  compartmentOcid: OCI_LINKS.compartments,
  userOcid: OCI_LINKS.myProfile,
  fingerprint: OCI_LINKS.myProfile,
} as const

export const SETUP_COPY: Record<string, SetupCopy> = {
  ja: {
    badge: 'MinorWire セットアップ',
    title: '貼る値はこれだけ',
    intro:
      'OCI の最小権限キーを一度貼るだけです。Always Free 上に WireGuard サーバを1台作ります。その後は端末用 .conf を何度でも追加できます。OCI API キーは保存しません。',
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
    targetTitle: '「Target Compartment」とは？',
    targetBody:
      'フォーム項目ではありません。IAM ポリシー文の中の仮名でした。root コンパートメントの Name はだいたいテナンシ名と同じです（例: jittee）。その Name をセクション B のポリシー欄へ。OCID は下の項目3へ貼ります。',
    urlsTitle: 'Oracle Console 直リンク（ブックマーク推奨）',
    urlsIntro: '先にログインしてから各リンクを開いてください。リージョンは ap-tokyo-1（東京）固定です。',
    urlHome: 'コンソールホーム',
    urlHomeHint: 'ログアウト時はここから',
    urlTenancy: 'Tenancy Details',
    urlTenancyHint: 'Tenancy OCID とホームリージョン確認',
    urlCompartments: 'Compartments',
    urlCompartmentsHint: 'root の OCID をコピー / ポリシー用 Name を確認',
    urlDomains: 'Identity Domains',
    urlDomainsHint: 'Users / Groups / Policies の入口',
    urlProfile: 'My profile',
    urlProfileHint: 'User OCID。Fingerprint と PEM は Tokens and keys タブ',
    urlPolicies: 'Policies',
    urlPoliciesHint: 'セクション B の IAM ポリシーを貼る',
    prepareTitle: 'A. Oracle 側の準備（1回）',
    prepareSteps: [
      'コンソールにログインする',
      'Domains → Default → Groups → グループ MinorWire を作成（無ければ）',
      '同じドメイン → Users → API 用ユーザーを用意 → グループ MinorWire に追加',
      'Policies → ポリシー作成 → セクション B を貼る',
      'My profile → Tokens and keys → Add API Key → .pem を一度だけダウンロード',
    ],
    figTenancy: 'Tenancy OCID（ぼかし）。Profile → Tenancy → OCID。',
    figCompartment: 'Compartment 一覧: Name はポリシー用、OCID は項目3。',
    figApiKeys: 'User OCID + Fingerprint + 秘密鍵ダウンロード。',
    policyTitle: 'B. IAM ポリシー（Oracle に貼る）',
    policyIntroBefore:
      'コンパートメントの Name を入力（root ならテナンシ名。例: jittee。OCID ではない）。内容をコピーして ',
    policyIntroAfter: ' に貼ります。',
    policyNameLabel: 'ポリシー文用のコンパートメント名のみ',
    policyNamePlaceholder: 'root の名前（多くの場合テナンシ名）',
    copyPolicy: 'ポリシーをコピー',
    copiedPolicy: 'コピー済み',
    formTitle: 'C. このフォームに貼る',
    formIntro: 'VPN 作成に送るのはこれらの欄だけです。',
    fields: [
      {
        key: 'region',
        label: '1. ホームリージョン',
        placeholder: 'ap-tokyo-1',
        where:
          '東京なら通常 ap-tokyo-1。Tenancy Details の Home region が NRT なら東京です。',
        url: fieldUrls.region,
        urlLabel: 'Tenancy Details を開く',
      },
      {
        key: 'tenancyOcid',
        label: '2. Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: 'Tenancy Details → General information → OCID をコピー。ocid1.tenancy.oc1.. で始まる。',
        url: fieldUrls.tenancyOcid,
        urlLabel: 'Tenancy Details を開く（OCID コピー）',
      },
      {
        key: 'compartmentOcid',
        label: '3. Compartment OCID（VM を作るフォルダ）',
        placeholder: 'ocid1.tenancy.oc1.. または ocid1.compartment.oc1..',
        where:
          'Compartments → root 行（多くは テナンシ名 (root)）の OCID。初心者は Tenancy OCID と同じでOK。Name（例: jittee）はここではなくポリシー欄へ。',
        url: fieldUrls.compartmentOcid,
        urlLabel: 'Compartments を開く（root OCID）',
      },
      {
        key: 'userOcid',
        label: '4. User OCID（API ユーザー）',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: 'My profile（または Domains → Users）→ Details → OCID。ocid1.user.oc1.. で始まる。',
        url: fieldUrls.userOcid,
        urlLabel: 'My profile を開く（User OCID）',
      },
      {
        key: 'fingerprint',
        label: '5. API キーの Fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where:
          'My profile → Tokens and keys → API Keys → Fingerprint。無ければ Add API Key で .pem を保存してからコピー。',
        url: fieldUrls.fingerprint,
        urlLabel: 'My profile → Tokens and keys',
      },
      {
        key: 'peerName',
        label: '6. 最初の端末名（.conf の名前）',
        placeholder: 'phone',
        where: '好きな英数字。例: phone, laptop。Oracle にはありません。',
        required: false,
      },
    ],
    pemLabel: '7. API 秘密鍵（PEM の中身）',
    pemWhere:
      'My profile → Tokens and keys → Add API Key → .pem をダウンロード → メモ帳で開き BEGIN/END ごと貼る。',
    pemUrlLabel: 'My profile を開く（Tokens and keys）',
    submitBusy: '開始中…',
    submit: 'VPN を作成',
    missingSession: 'session_id がありません。先に PayNow で支払いを完了してください。',
    paymentUnverified: '支払いを確認できません',
    verifyFailed: '支払い確認に失敗しました',
    failedStart: '開始に失敗しました',
    networkError: 'ネットワークエラー',
    failedPeer: '端末設定の追加に失敗しました',
  },

  en: {
    badge: 'MinorWire setup',
    title: 'Fill these values only',
    intro:
      'Paste a least-privilege OCI API key once. We create one Always Free WireGuard server. Afterwards you can mint more device .conf files. OCI API keys are not stored.',
    verifying: 'Verifying payment…',
    cannotStart: 'Cannot start setup',
    back: 'Back to MinorWire',
    purchase: 'Purchase',
    status: 'Status',
    publicIp: 'Public IP',
    working: 'Working… this can take several minutes.',
    doneNote:
      'OCI server for this purchase is fixed (one server). Device .conf files can be added below anytime.',
    confTitle: (name) => `WireGuard config (${name})`,
    downloadConf: (name) => `Download ${name}.conf`,
    addPeerTitle: 'Add another device .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: 'Adding…',
    addPeerSubmit: 'Create device config',
    targetTitle: 'What was "Target Compartment"?',
    targetBody:
      'It is not a form field. It was only a placeholder inside the IAM policy text. The root compartment Name is usually the same as the tenancy name (example: jittee). Put that name into section B. Put the compartment OCID into field 3 below.',
    urlsTitle: 'Direct Oracle Console URLs (bookmark these)',
    urlsIntro: 'Sign in first, then open each link. Region is fixed to ap-tokyo-1 (Japan East / Tokyo).',
    urlHome: 'Console home',
    urlHomeHint: 'start here if logged out',
    urlTenancy: 'Tenancy Details',
    urlTenancyHint: 'copy Tenancy OCID + confirm home region',
    urlCompartments: 'Compartments',
    urlCompartmentsHint: 'copy root compartment OCID; note the Name for the policy',
    urlDomains: 'Identity Domains',
    urlDomainsHint: 'Users / Groups / Policies entry',
    urlProfile: 'My profile',
    urlProfileHint: 'User OCID; then Tokens and keys for Fingerprint + PEM',
    urlPolicies: 'Policies',
    urlPoliciesHint: 'paste the IAM policy from section B',
    prepareTitle: 'A. Prepare in Oracle (once)',
    prepareSteps: [
      'Sign in at the Console home',
      'Domains → Default → Groups → create group MinorWire (if missing)',
      'Same domain → Users → create an API user (or use admin) → add to MinorWire',
      'Policies → create a policy → paste section B',
      'My profile → Tokens and keys → Add API Key → download the .pem once',
    ],
    figTenancy: 'Tenancy OCID (blurred). Profile → Tenancy → OCID.',
    figCompartment: 'Compartment list: Name is for the policy text; OCID is field 3.',
    figApiKeys: 'User OCID + fingerprint + private key download.',
    policyTitle: 'B. IAM policy (copy into Oracle)',
    policyIntroBefore:
      'Type the compartment Name (for root, usually the tenancy name like jittee — not an OCID). Then copy the box and paste into ',
    policyIntroAfter: '.',
    policyNameLabel: 'Compartment name for policy text only',
    policyNamePlaceholder: 'root compartment name (often your tenancy name)',
    copyPolicy: 'Copy policy',
    copiedPolicy: 'Copied',
    formTitle: 'C. Paste into this form',
    formIntro: 'Only these fields are sent to create the VPN.',
    fields: [
      {
        key: 'region',
        label: '1. Home region',
        placeholder: 'ap-tokyo-1',
        where: 'Usually ap-tokyo-1 for Japan East (Tokyo). Confirm Home region NRT on Tenancy Details.',
        url: fieldUrls.region,
        urlLabel: 'Open Tenancy Details',
      },
      {
        key: 'tenancyOcid',
        label: '2. Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: 'Tenancy Details → General information → OCID. Starts with ocid1.tenancy.oc1..',
        url: fieldUrls.tenancyOcid,
        urlLabel: 'Open Tenancy Details (copy OCID)',
      },
      {
        key: 'compartmentOcid',
        label: '3. Compartment OCID (folder for the VM)',
        placeholder: 'ocid1.tenancy.oc1.. OR ocid1.compartment.oc1..',
        where:
          'Compartments → root row OCID. Beginners: often the same as Tenancy OCID. The Name goes into the policy box, not here.',
        url: fieldUrls.compartmentOcid,
        urlLabel: 'Open Compartments (copy root OCID)',
      },
      {
        key: 'userOcid',
        label: '4. User OCID (API user)',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: 'My profile → Details → OCID. Starts with ocid1.user.oc1..',
        url: fieldUrls.userOcid,
        urlLabel: 'Open My profile (copy User OCID)',
      },
      {
        key: 'fingerprint',
        label: '5. API key fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where:
          'My profile → Tokens and keys → API Keys → Fingerprint. If empty: Add API Key, save .pem, then copy.',
        url: fieldUrls.fingerprint,
        urlLabel: 'Open My profile → Tokens and keys',
      },
      {
        key: 'peerName',
        label: '6. First device name (for the .conf file name)',
        placeholder: 'phone',
        where: 'Any short name (letters/numbers). Example: phone, laptop. Not from Oracle.',
        required: false,
      },
    ],
    pemLabel: '7. API private key (PEM file contents)',
    pemWhere:
      'My profile → Tokens and keys → Add API Key → download .pem → open in Notepad → paste including BEGIN / END.',
    pemUrlLabel: 'Open My profile (then Tokens and keys)',
    submitBusy: 'Starting…',
    submit: 'Create VPN',
    missingSession: 'Missing session_id. Complete PayNow checkout first.',
    paymentUnverified: 'Payment not verified',
    verifyFailed: 'Could not verify payment',
    failedStart: 'Failed to start',
    networkError: 'Network error',
    failedPeer: 'Failed to add device config',
  },

  zh: {
    badge: 'MinorWire 安装向导',
    title: '只需填写这些值',
    intro:
      '粘贴一次最小权限 OCI API 密钥。我们会在 Always Free 上创建一台 WireGuard 服务器。之后可随时再生成设备 .conf。不会保存 OCI API 密钥。',
    verifying: '正在验证付款…',
    cannotStart: '无法开始安装',
    back: '返回 MinorWire',
    purchase: '购买',
    status: '状态',
    publicIp: '公网 IP',
    working: '处理中… 可能需要几分钟。',
    doneNote: '本次购买只对应一台 OCI 服务器。设备 .conf 可在下方随时追加。',
    confTitle: (name) => `WireGuard 配置 (${name})`,
    downloadConf: (name) => `下载 ${name}.conf`,
    addPeerTitle: '添加另一台设备的 .conf',
    addPeerPlaceholder: 'iphone',
    addPeerBusy: '添加中…',
    addPeerSubmit: '创建设备配置',
    targetTitle: '什么是 “Target Compartment”？',
    targetBody:
      '它不是表单字段，只是 IAM 策略文案里的占位名。根 compartment 的 Name 通常与租户名相同（例如 jittee）。把 Name 填到 B 段策略框；把 OCID 填到下面第 3 项。',
    urlsTitle: 'Oracle 控制台直达链接（建议收藏）',
    urlsIntro: '请先登录，再打开各链接。区域固定为 ap-tokyo-1（东京）。',
    urlHome: '控制台首页',
    urlHomeHint: '未登录时从这里进入',
    urlTenancy: 'Tenancy Details',
    urlTenancyHint: '复制 Tenancy OCID 并确认主区域',
    urlCompartments: 'Compartments',
    urlCompartmentsHint: '复制根 compartment OCID；记下策略用 Name',
    urlDomains: 'Identity Domains',
    urlDomainsHint: 'Users / Groups / Policies 入口',
    urlProfile: 'My profile',
    urlProfileHint: 'User OCID；Fingerprint 与 PEM 在 Tokens and keys',
    urlPolicies: 'Policies',
    urlPoliciesHint: '粘贴 B 段 IAM 策略',
    prepareTitle: 'A. 在 Oracle 中准备（一次）',
    prepareSteps: [
      '登录控制台首页',
      'Domains → Default → Groups → 创建组 MinorWire（如没有）',
      '同一域名 → Users → 准备 API 用户 → 加入 MinorWire',
      'Policies → 创建策略 → 粘贴 B 段',
      'My profile → Tokens and keys → Add API Key → 下载一次 .pem',
    ],
    figTenancy: 'Tenancy OCID（已打码）。Profile → Tenancy → OCID。',
    figCompartment: 'Compartment 列表：Name 用于策略，OCID 用于第 3 项。',
    figApiKeys: 'User OCID + Fingerprint + 私钥下载。',
    policyTitle: 'B. IAM 策略（粘贴到 Oracle）',
    policyIntroBefore:
      '填写 compartment 的 Name（根目录通常是租户名，如 jittee，不是 OCID）。复制后粘贴到 ',
    policyIntroAfter: '。',
    policyNameLabel: '仅用于策略文案的 compartment 名称',
    policyNamePlaceholder: '根 compartment 名称（多为租户名）',
    copyPolicy: '复制策略',
    copiedPolicy: '已复制',
    formTitle: 'C. 粘贴到本表单',
    formIntro: '创建 VPN 只会提交这些字段。',
    fields: [
      {
        key: 'region',
        label: '1. 主区域',
        placeholder: 'ap-tokyo-1',
        where: '东京一般为 ap-tokyo-1。Tenancy Details 中 Home region 为 NRT 即东京。',
        url: fieldUrls.region,
        urlLabel: '打开 Tenancy Details',
      },
      {
        key: 'tenancyOcid',
        label: '2. Tenancy OCID',
        placeholder: 'ocid1.tenancy.oc1..aaaa...',
        where: 'Tenancy Details → General information → OCID。以 ocid1.tenancy.oc1.. 开头。',
        url: fieldUrls.tenancyOcid,
        urlLabel: '打开 Tenancy Details（复制 OCID）',
      },
      {
        key: 'compartmentOcid',
        label: '3. Compartment OCID（创建 VM 的目录）',
        placeholder: 'ocid1.tenancy.oc1.. 或 ocid1.compartment.oc1..',
        where:
          'Compartments → 根行 OCID。新手可与 Tenancy OCID 相同。Name（如 jittee）只填策略框，不填这里。',
        url: fieldUrls.compartmentOcid,
        urlLabel: '打开 Compartments（根 OCID）',
      },
      {
        key: 'userOcid',
        label: '4. User OCID（API 用户）',
        placeholder: 'ocid1.user.oc1..aaaa...',
        where: 'My profile → Details → OCID。以 ocid1.user.oc1.. 开头。',
        url: fieldUrls.userOcid,
        urlLabel: '打开 My profile（User OCID）',
      },
      {
        key: 'fingerprint',
        label: '5. API 密钥 Fingerprint',
        placeholder: 'aa:bb:cc:dd:...',
        where:
          'My profile → Tokens and keys → API Keys → Fingerprint。没有则 Add API Key，保存 .pem 后再复制。',
        url: fieldUrls.fingerprint,
        urlLabel: '打开 My profile → Tokens and keys',
      },
      {
        key: 'peerName',
        label: '6. 首台设备名（.conf 文件名）',
        placeholder: 'phone',
        where: '任意英文数字。例如 phone、laptop。不是 Oracle 里的字段。',
        required: false,
      },
    ],
    pemLabel: '7. API 私钥（PEM 全文）',
    pemWhere:
      'My profile → Tokens and keys → Add API Key → 下载 .pem → 用记事本打开 → 连 BEGIN/END 一起粘贴。',
    pemUrlLabel: '打开 My profile（Tokens and keys）',
    submitBusy: '启动中…',
    submit: '创建 VPN',
    missingSession: '缺少 session_id。请先完成 PayNow 付款。',
    paymentUnverified: '无法验证付款',
    verifyFailed: '付款验证失败',
    failedStart: '启动失败',
    networkError: '网络错误',
    failedPeer: '添加设备配置失败',
  },
}
