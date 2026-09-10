import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Resolve files under private/ for both local `next start` (cwd = repo root)
 * and Firebase App Hosting standalone (cwd = .next/standalone).
 */
export function resolvePrivateAsset(...parts: string[]): string {
  const relative = join('private', ...parts)
  const candidates = [
    join(process.cwd(), relative),
    join(process.cwd(), '.next', 'standalone', relative),
    // Dist layout when process is started from repo root but assets were traced
    // only into the standalone tree.
    join(process.cwd(), '..', relative),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  throw new Error(
    `Missing private asset ${relative} (tried: ${candidates.join(', ')})`,
  )
}
