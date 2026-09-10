import { readFileSync } from 'node:fs'
import { resolvePrivateAsset } from './privateAssets'

export function getMinorWireZipPath(): string {
  return resolvePrivateAsset('minorwire', 'minorwire-cli.zip')
}

export function readMinorWireZip(): Buffer {
  return readFileSync(getMinorWireZipPath())
}
