/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  serverExternalPackages: ['oci-common', 'oci-core', 'oci-identity', 'ssh2', 'firebase-admin'],
}

module.exports = nextConfig
 