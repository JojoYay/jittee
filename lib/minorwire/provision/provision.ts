import { randomBytes } from 'node:crypto'
import * as core from 'oci-core'
import type { OciCredentials, ProvisionResult } from './types'
import { createClients } from './client'
import { validateCredentials } from './validate'
import { generateInstanceSshKeyPair } from './sshKeys'

const SHAPE = 'VM.Standard.E2.1.Micro'
const DISPLAY_PREFIX = 'minorwire'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function pickUbuntuImage(compute: core.ComputeClient, compartmentId: string): Promise<string> {
  const res = await compute.listImages({
    compartmentId,
    operatingSystem: 'Canonical Ubuntu',
    operatingSystemVersion: '24.04',
    shape: SHAPE,
    sortBy: core.requests.ListImagesRequest.SortBy.Timecreated,
    sortOrder: core.requests.ListImagesRequest.SortOrder.Desc,
    limit: 20,
  })
  const images = (res.items ?? []).filter((i) => !i.displayName?.toLowerCase().includes('aarch64'))
  const img = images[0]
  if (!img?.id) {
    throw new Error('No Ubuntu 24.04 image found for VM.Standard.E2.1.Micro in this compartment/region')
  }
  return img.id
}

async function waitInstanceRunning(compute: core.ComputeClient, instanceId: string): Promise<void> {
  for (let i = 0; i < 60; i++) {
    const { instance } = await compute.getInstance({ instanceId })
    const state = instance.lifecycleState
    if (state === 'RUNNING') return
    if (state === 'TERMINATED' || state === 'TERMINATING') {
      throw new Error(`Instance entered ${state}`)
    }
    await sleep(10_000)
  }
  throw new Error('Timed out waiting for instance RUNNING')
}

async function getPrimaryIps(
  compute: core.ComputeClient,
  network: core.VirtualNetworkClient,
  compartmentId: string,
  instanceId: string,
): Promise<{ publicIp: string; privateIp: string }> {
  for (let i = 0; i < 30; i++) {
    const attachments = await compute.listVnicAttachments({ compartmentId, instanceId })
    const primary = (attachments.items ?? []).find((a) => a.lifecycleState === 'ATTACHED' && a.vnicId)
    if (primary?.vnicId) {
      const { vnic } = await network.getVnic({ vnicId: primary.vnicId })
      if (vnic.privateIp) {
        return {
          privateIp: vnic.privateIp,
          publicIp: vnic.publicIp ?? '',
        }
      }
    }
    await sleep(5_000)
  }
  throw new Error('Could not resolve instance VNIC / IP addresses')
}

export async function provisionAlwaysFreeVpn(
  creds: OciCredentials,
  options: { displayName?: string } = {},
): Promise<ProvisionResult> {
  const validated = await validateCredentials(creds)
  const { compute, network } = createClients(creds)
  const availabilityDomain = validated.availabilityDomains[0]
  const displayName = options.displayName ?? `${DISPLAY_PREFIX}-${randomBytes(3).toString('hex')}`
  const { publicKeyOpenSsh, privateKeyPem: sshPrivateKeyPem } = generateInstanceSshKeyPair()

  const vcnRes = await network.createVcn({
    createVcnDetails: {
      compartmentId: creds.compartmentOcid.trim(),
      displayName: `${displayName}-vcn`,
      cidrBlocks: ['10.0.0.0/16'],
      dnsLabel: `mw${randomBytes(2).toString('hex')}`,
    },
  })
  const vcn = vcnRes.vcn
  if (!vcn.id || !vcn.defaultRouteTableId) {
    throw new Error('createVcn did not return id / defaultRouteTableId')
  }

  const igRes = await network.createInternetGateway({
    createInternetGatewayDetails: {
      compartmentId: creds.compartmentOcid.trim(),
      vcnId: vcn.id,
      displayName: `${displayName}-igw`,
      isEnabled: true,
    },
  })
  const igwId = igRes.internetGateway.id
  if (!igwId) throw new Error('createInternetGateway missing id')

  await network.updateRouteTable({
    rtId: vcn.defaultRouteTableId,
    updateRouteTableDetails: {
      routeRules: [
        {
          destination: '0.0.0.0/0',
          destinationType: core.models.RouteRule.DestinationType.CidrBlock,
          networkEntityId: igwId,
        },
      ],
    },
  })

  const slRes = await network.createSecurityList({
    createSecurityListDetails: {
      compartmentId: creds.compartmentOcid.trim(),
      vcnId: vcn.id,
      displayName: `${displayName}-sl`,
      egressSecurityRules: [
        {
          destination: '0.0.0.0/0',
          protocol: 'all',
          destinationType: core.models.EgressSecurityRule.DestinationType.CidrBlock,
        },
      ],
      ingressSecurityRules: [
        {
          source: '0.0.0.0/0',
          protocol: '6',
          sourceType: core.models.IngressSecurityRule.SourceType.CidrBlock,
          tcpOptions: { destinationPortRange: { min: 22, max: 22 } },
          description: 'SSH',
        },
        {
          source: '0.0.0.0/0',
          protocol: '17',
          sourceType: core.models.IngressSecurityRule.SourceType.CidrBlock,
          udpOptions: { destinationPortRange: { min: 51820, max: 51820 } },
          description: 'WireGuard',
        },
      ],
    },
  })
  const securityListId = slRes.securityList.id
  if (!securityListId) throw new Error('createSecurityList missing id')

  const subnetRes = await network.createSubnet({
    createSubnetDetails: {
      compartmentId: creds.compartmentOcid.trim(),
      vcnId: vcn.id,
      cidrBlock: '10.0.0.0/24',
      displayName: `${displayName}-public`,
      routeTableId: vcn.defaultRouteTableId,
      securityListIds: [securityListId],
      dnsLabel: 'public',
      prohibitPublicIpOnVnic: false,
    },
  })
  const subnetId = subnetRes.subnet.id
  if (!subnetId) throw new Error('createSubnet missing id')

  const imageId = await pickUbuntuImage(compute, creds.tenancyOcid.trim())
  const sourceDetails: core.models.InstanceSourceViaImageDetails = {
    sourceType: 'image',
    imageId,
  }
  const launch = await compute.launchInstance({
    launchInstanceDetails: {
      availabilityDomain,
      compartmentId: creds.compartmentOcid.trim(),
      displayName,
      shape: SHAPE,
      sourceDetails,
      createVnicDetails: {
        subnetId,
        assignPublicIp: true,
        displayName: `${displayName}-vnic`,
      },
      metadata: {
        ssh_authorized_keys: publicKeyOpenSsh,
      },
    },
  })
  const instanceId = launch.instance.id
  if (!instanceId) throw new Error('launchInstance missing id')

  await waitInstanceRunning(compute, instanceId)
  const ips = await getPrimaryIps(compute, network, creds.compartmentOcid.trim(), instanceId)
  if (!ips.publicIp) {
    throw new Error('Instance has no public IP; check subnet / assignPublicIp settings')
  }

  return {
    instanceId,
    displayName,
    publicIp: ips.publicIp,
    privateIp: ips.privateIp,
    availabilityDomain,
    subnetId,
    vcnId: vcn.id,
    region: creds.region,
    sshPrivateKeyPem,
  }
}
