/**
 * 公式MCPレジストリの所有確認 (/.well-known/mcp-registry-auth)
 *
 * `com.jittee/*` の名前空間で公開するために、jittee.com の持ち主であることを
 * 公開鍵で示す。中身は公開鍵だけなので秘密は含まない (対の秘密鍵は手元のみ)。
 *
 * ⚠ `public/.well-known/` に置くだけでは配られなかった (standalone のビルドが
 *    ドットで始まるフォルダを運ばない)。ここで**必ず返す**ようにして、
 *    next.config.js の rewrites で `/.well-known/...` からつないでいる。
 */
export const dynamic = 'force-static'

const RECORD = 'v=MCPv1; k=ed25519; p=USckVWR5tir3JjdkYPmEivxtkoAI3+npBu1zMOWAi9M='

export function GET() {
  return new Response(`${RECORD}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
