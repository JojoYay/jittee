/**
 * SplitBill のMCPの表玄関 — https://jittee.com/mcp/splitbill
 *
 * 中身はSupabaseのEdge Function (warikan-mcp) で、ここは**素通しの中継**。
 * 置いている理由は見た目だけではなく、
 *   ・利用者に見せるURLがうちのドメインになる (レジストリ掲載でも効く)
 *   ・置き場所 (Supabaseのプロジェクト) を将来変えても、URLを変えずに済む
 * ため。
 *
 * ⚠ **触らずに渡す。** 認証ヘッダーも本文もクエリもそのまま送り、返ってきた
 *    ものをそのまま返す (SSEのため本文はストリームのまま流す)。
 */
const UPSTREAM = process.env.SPLITBILL_MCP_UPSTREAM
  ?? 'https://yyeleqhfbbjnscaddutx.supabase.co/functions/v1/warikan-mcp'

/** 送る値 (これ以外は落とす。Cookieなどを上流へ流さない) */
const PASS_REQ = [
  'authorization',
  'content-type',
  'accept',
  'mcp-protocol-version',
  'mcp-session-id',
  'last-event-id',
  'user-agent',
]

/** 返す値 */
const PASS_RES = [
  'content-type',
  'cache-control',
  'www-authenticate',
  'mcp-session-id',
  'access-control-allow-origin',
  'access-control-allow-headers',
  'access-control-allow-methods',
]

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function proxy(req: Request, rest: string[] | undefined) {
  const url = new URL(req.url)
  const tail = (rest ?? []).length > 0 ? `/${(rest ?? []).join('/')}` : ''
  const target = `${UPSTREAM}${tail}${url.search}`

  const headers = new Headers()
  for (const k of PASS_REQ) {
    const v = req.headers.get(k)
    if (v) headers.set(k, v)
  }

  const method = req.method
  const body = method === 'GET' || method === 'HEAD' ? undefined : await req.arrayBuffer()

  const upstream = await fetch(target, {
    method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    // SSE を途中で切らない
    cache: 'no-store',
  })

  const out = new Headers()
  for (const k of PASS_RES) {
    const v = upstream.headers.get(k)
    if (v) out.set(k, v)
  }
  if (!out.has('access-control-allow-origin')) out.set('access-control-allow-origin', '*')

  return new Response(upstream.body, { status: upstream.status, headers: out })
}

type Ctx = { params: Promise<{ rest?: string[] }> }

export async function GET(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).rest)
}
export async function POST(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).rest)
}
export async function DELETE(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).rest)
}
export async function OPTIONS(req: Request, ctx: Ctx) {
  return proxy(req, (await ctx.params).rest)
}
