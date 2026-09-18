/**
 * OpenAI の所有確認 (/.well-known/openai-apps-challenge)
 *
 * ChatGPT のプラグイン申請で、MCPサーバーのホスト (jittee.com) を持っている
 * ことを示すために、申請画面が出すトークンを**そのまま**返す。
 *
 * ⚠ トークンは申請画面の「Domain not verified」の所に出てくる。ここに貼って
 *    push するだけ (App Hosting が数分で配る)。未設定の間は 404 を返す —
 *    空文字を配ると「確認したが値が違う」と判定されて紛らわしいため。
 *
 * ⚠ `public/.well-known/` に置いても配られない (standalone のビルドがドットで
 *    始まるフォルダを運ばない)。mcp-registry-auth と同じく、ここで返して
 *    next.config.js の rewrites でつなぐ。
 */
export const dynamic = 'force-static'

/** 申請画面が出したトークン。取得したらここに貼る */
const TOKEN = process.env.OPENAI_APPS_CHALLENGE ?? ''

export function GET() {
  if (!TOKEN) return new Response('not configured', { status: 404 })
  return new Response(`${TOKEN}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
