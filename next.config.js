/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase App Hosting uses standalone; keep it explicit so local builds match prod layout.
  output: 'standalone',
  // Runtime-read assets (not statically importable) must be traced into standalone.
  outputFileTracingIncludes: {
    '/api/minorwire/*': ['./private/minorwire/**/*'],
    '/api/minorwire/*/\\[*\\]/*': ['./private/minorwire/**/*'],
    '/api/minorwire/jobs/*/run': ['./private/minorwire/**/*'],
    '/api/minorwire/download': ['./private/minorwire/**/*'],
    '/*': ['./private/minorwire/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  serverExternalPackages: ['oci-common', 'oci-core', 'oci-identity', 'ssh2', 'firebase-admin'],
  async rewrites() {
    return [
      // 公式MCPレジストリの所有確認。ドットで始まるフォルダは public からも
      // app/ からも運ばれないので、普通のルートに寄せてここでつなぐ
      { source: '/.well-known/mcp-registry-auth', destination: '/well-known/mcp-registry-auth' },
      // ChatGPT のプラグイン申請のドメイン確認 (トークン未設定のうちは404)
      { source: '/.well-known/openai-apps-challenge', destination: '/well-known/openai-apps-challenge' },
      // SplitBillのMCP (/mcp/splitbill) の認可の案内。401 の WWW-Authenticate が
      // 案内するのは資源URLの下 (…/mcp/splitbill/.well-known/…) だが、RFC 9728 が
      // 決めた正規の場所を先に見に来るクライアントもいるので、そこへ寄せる。
      // 中身は中継先 (Edge Function) が返すものをそのまま使う (二重管理を避ける)
      {
        source: '/.well-known/oauth-protected-resource/mcp/splitbill',
        destination: '/mcp/splitbill/.well-known/oauth-protected-resource',
      },
      {
        source: '/.well-known/oauth-authorization-server/mcp/splitbill',
        destination: '/mcp/splitbill/.well-known/oauth-authorization-server',
      },
    ]
  },
}

module.exports = nextConfig
