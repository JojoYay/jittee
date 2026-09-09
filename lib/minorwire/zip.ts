import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function getMinorWireZipPath(): string {
  return join(process.cwd(), 'private', 'minorwire', 'minorwire-cli.zip')
}

export function readMinorWireZip(): Buffer {
  const path = getMinorWireZipPath()
  if (!existsSync(path)) {
    throw new Error(`Missing package at ${path}`)
  }
  return readFileSync(path)
}
