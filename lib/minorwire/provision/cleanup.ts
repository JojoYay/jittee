import * as core from 'oci-core'
import { DISPLAY_PREFIX } from './provisionConstants'

export type CleanupLogFn = (message: string) => void | Promise<void>

const INSTANCE_TERMINATE_ATTEMPTS = 90
const NETWORK_DELETE_ATTEMPTS = 60
const POLL_MS = 10_000

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function log(fn: CleanupLogFn | undefined, message: string): Promise<void> {
  if (!fn) return
  await fn(message)
}

/** Case-sensitive product ownership check (matches DISPLAY_PREFIX naming). */
export function isMinorwireOwnedName(displayName: string | undefined | null): boolean {
  const name = (displayName || '').trim()
  return name.startsWith(`${DISPLAY_PREFIX}-`)
}

function isNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { statusCode?: number; serviceCode?: string; code?: string; message?: string }
  if (e.statusCode === 404) return true
  const code = `${e.serviceCode || e.code || ''}`.toLowerCase()
  if (code.includes('notauthorizedornotfound') || code.includes('notfound')) return true
  const msg = `${e.message || ''}`.toLowerCase()
  return msg.includes('not found') || msg.includes('does not exist')
}

async function ignoreNotFound(fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn()
  } catch (err) {
    if (!isNotFoundError(err)) throw err
  }
}

async function listAllInstances(
  compute: core.ComputeClient,
  compartmentId: string,
): Promise<core.models.Instance[]> {
  const out: core.models.Instance[] = []
  let page: string | undefined
  do {
    const res = await compute.listInstances({ compartmentId, limit: 100, page })
    out.push(...(res.items ?? []))
    page = res.opcNextPage
  } while (page)
  return out
}

async function listAllVcns(
  network: core.VirtualNetworkClient,
  compartmentId: string,
): Promise<core.models.Vcn[]> {
  const out: core.models.Vcn[] = []
  let page: string | undefined
  do {
    const res = await network.listVcns({ compartmentId, limit: 100, page })
    out.push(...(res.items ?? []))
    page = res.opcNextPage
  } while (page)
  return out
}

async function waitInstancesTerminated(
  compute: core.ComputeClient,
  instanceIds: string[],
  onLog?: CleanupLogFn,
): Promise<void> {
  if (!instanceIds.length) return
  for (let i = 0; i < INSTANCE_TERMINATE_ATTEMPTS; i++) {
    const states: string[] = []
    let allDone = true
    for (const instanceId of instanceIds) {
      try {
        const { instance } = await compute.getInstance({ instanceId })
        const state = instance.lifecycleState || 'UNKNOWN'
        states.push(state)
        if (state !== 'TERMINATED') allDone = false
      } catch (err) {
        if (isNotFoundError(err)) {
          states.push('TERMINATED')
        } else {
          throw err
        }
      }
    }
    if (allDone) {
      await log(onLog, `Terminated ${instanceIds.length} prior MinorWire instance(s)`)
      return
    }
    if (i === 0 || i % 3 === 0) {
      await log(onLog, `Waiting for instance terminate (${states.join(', ')})`)
    }
    await sleep(POLL_MS)
  }
  throw new Error(
    `Timed out waiting for MinorWire instance(s) to TERMINATED (${instanceIds.length} id(s))`,
  )
}

async function terminateMinorwireInstances(
  compute: core.ComputeClient,
  compartmentId: string,
  onLog?: CleanupLogFn,
): Promise<void> {
  const instances = await listAllInstances(compute, compartmentId)
  const targets = instances.filter(
    (inst) =>
      isMinorwireOwnedName(inst.displayName) &&
      inst.id &&
      inst.lifecycleState !== 'TERMINATED',
  )
  if (!targets.length) {
    await log(onLog, 'No prior MinorWire instances to terminate')
    return
  }

  await log(
    onLog,
    `Terminating ${targets.length} prior MinorWire instance(s): ${targets
      .map((t) => t.displayName)
      .join(', ')}`,
  )

  const ids: string[] = []
  for (const inst of targets) {
    const instanceId = inst.id!
    ids.push(instanceId)
    if (inst.lifecycleState === 'TERMINATING') continue
    await ignoreNotFound(() =>
      compute.terminateInstance({
        instanceId,
        preserveBootVolume: false,
      }),
    )
  }
  await waitInstancesTerminated(compute, ids, onLog)
}

async function waitGone(
  label: string,
  check: () => Promise<boolean>,
  onLog?: CleanupLogFn,
): Promise<void> {
  for (let i = 0; i < NETWORK_DELETE_ATTEMPTS; i++) {
    if (await check()) return
    if (i === 0 || i % 3 === 0) {
      await log(onLog, `Waiting for ${label} delete`)
    }
    await sleep(POLL_MS)
  }
  throw new Error(`Timed out waiting for ${label} to be deleted`)
}

async function deleteVcnStack(
  network: core.VirtualNetworkClient,
  compartmentId: string,
  vcn: core.models.Vcn,
  onLog?: CleanupLogFn,
): Promise<void> {
  const vcnId = vcn.id
  if (!vcnId) return
  const name = vcn.displayName || vcnId
  await log(onLog, `Cleaning MinorWire VCN ${name}`)

  // Subnets first (block VCN delete while present).
  const subnets = await network.listSubnets({ compartmentId, vcnId, limit: 100 })
  for (const subnet of subnets.items ?? []) {
    if (!subnet.id) continue
    await ignoreNotFound(() => network.deleteSubnet({ subnetId: subnet.id! }))
  }
  for (const subnet of subnets.items ?? []) {
    if (!subnet.id) continue
    const subnetId = subnet.id
    await waitGone(
      `subnet ${subnet.displayName || subnetId}`,
      async () => {
        try {
          const { subnet: s } = await network.getSubnet({ subnetId })
          return s.lifecycleState === 'TERMINATED'
        } catch (err) {
          return isNotFoundError(err)
        }
      },
      onLog,
    )
  }

  // Clear route rules so IGWs can be detached/deleted.
  const routeTables = await network.listRouteTables({ compartmentId, vcnId, limit: 100 })
  for (const rt of routeTables.items ?? []) {
    if (!rt.id) continue
    if ((rt.routeRules?.length ?? 0) === 0) continue
    await ignoreNotFound(() =>
      network.updateRouteTable({
        rtId: rt.id!,
        updateRouteTableDetails: { routeRules: [] },
      }),
    )
  }

  const igws = await network.listInternetGateways({ compartmentId, vcnId, limit: 100 })
  for (const igw of igws.items ?? []) {
    if (!igw.id) continue
    await ignoreNotFound(() => network.deleteInternetGateway({ igId: igw.id! }))
  }
  for (const igw of igws.items ?? []) {
    if (!igw.id) continue
    const igId = igw.id
    await waitGone(
      `igw ${igw.displayName || igId}`,
      async () => {
        try {
          const { internetGateway } = await network.getInternetGateway({ igId })
          return internetGateway.lifecycleState === 'TERMINATED'
        } catch (err) {
          return isNotFoundError(err)
        }
      },
      onLog,
    )
  }

  // Custom security lists / route tables only (defaults go away with the VCN).
  const securityLists = await network.listSecurityLists({ compartmentId, vcnId, limit: 100 })
  for (const sl of securityLists.items ?? []) {
    if (!sl.id || sl.id === vcn.defaultSecurityListId) continue
    await ignoreNotFound(() => network.deleteSecurityList({ securityListId: sl.id! }))
  }

  for (const rt of routeTables.items ?? []) {
    if (!rt.id || rt.id === vcn.defaultRouteTableId) continue
    await ignoreNotFound(() => network.deleteRouteTable({ rtId: rt.id! }))
  }

  await ignoreNotFound(() => network.deleteVcn({ vcnId }))
  await waitGone(
    `vcn ${name}`,
    async () => {
      try {
        const { vcn: current } = await network.getVcn({ vcnId })
        return current.lifecycleState === 'TERMINATED'
      } catch (err) {
        return isNotFoundError(err)
      }
    },
    onLog,
  )
  await log(onLog, `Deleted MinorWire VCN ${name}`)
}

async function deleteMinorwireVcns(
  network: core.VirtualNetworkClient,
  compartmentId: string,
  onLog?: CleanupLogFn,
): Promise<void> {
  const vcns = await listAllVcns(network, compartmentId)
  const targets = vcns.filter(
    (vcn) =>
      isMinorwireOwnedName(vcn.displayName) &&
      vcn.id &&
      vcn.lifecycleState !== 'TERMINATED',
  )
  if (!targets.length) {
    await log(onLog, 'No prior MinorWire VCNs to delete')
    return
  }

  await log(
    onLog,
    `Deleting ${targets.length} prior MinorWire VCN(s): ${targets.map((v) => v.displayName).join(', ')}`,
  )

  for (const vcn of targets) {
    await deleteVcnStack(network, compartmentId, vcn, onLog)
  }
}

/**
 * Remove leftover MinorWire compute + VCN stacks in the target compartment
 * (displayName prefix `minorwire-` only) so a retry can recreate cleanly.
 */
export async function cleanupExistingMinorwireResources(
  compute: core.ComputeClient,
  network: core.VirtualNetworkClient,
  compartmentId: string,
  onLog?: CleanupLogFn,
): Promise<void> {
  const cid = compartmentId.trim()
  await log(onLog, 'Checking for prior MinorWire OCI resources to clean up')
  await terminateMinorwireInstances(compute, cid, onLog)
  await deleteMinorwireVcns(network, cid, onLog)
  await log(onLog, 'Prior MinorWire OCI cleanup finished')
}
