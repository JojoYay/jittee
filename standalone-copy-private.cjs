/**
 * Copy private/minorwire runtime assets into the Next.js standalone output.
 * App Hosting runs from .next/standalone; file tracing often misses non-import paths.
 */
const { cpSync, existsSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')

const root = __dirname
const src = join(root, 'private', 'minorwire')
const dest = join(root, '.next', 'standalone', 'private', 'minorwire')

if (!existsSync(src)) {
  console.warn('[standalone-copy-private] skip: private/minorwire missing')
  process.exit(0)
}

if (!existsSync(join(root, '.next', 'standalone'))) {
  console.warn('[standalone-copy-private] skip: .next/standalone missing')
  process.exit(0)
}

mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[standalone-copy-private] copied private/minorwire -> .next/standalone/private/minorwire')
