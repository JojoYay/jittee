/** Copy-ready IAM policy statements for a group named MinorWire. */
export function buildIamPolicy(compartmentName: string): string {
  const c = compartmentName.trim() || 'REPLACE_WITH_COMPARTMENT_NAME'
  return [
    `Allow group MinorWire to manage instance-family in compartment ${c}`,
    `Allow group MinorWire to manage volume-family in compartment ${c}`,
    `Allow group MinorWire to manage virtual-network-family in compartment ${c}`,
    `Allow group MinorWire to use vnics in compartment ${c}`,
    `Allow group MinorWire to use subnets in compartment ${c}`,
    'Allow group MinorWire to read app-catalog-listing in tenancy',
    'Allow group MinorWire to inspect compartments in tenancy',
    'Allow group MinorWire to read instance-images in tenancy',
  ].join('\n')
}
