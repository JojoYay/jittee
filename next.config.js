/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase App Hosting uses standalone; keep it explicit so local builds match prod layout.
  output: 'standalone',
  // Runtime-read assets (not statically importable) must be traced into standalone.
  outputFileTracingIncludes: {
    '/api/minorwire/*': ['./private/minorwire/**/*'],
    '/api/minorwire/*/\\[*\\]/*': ['./private/minorwire/**/*'],
    '/api/minorwire/jobs/*/run': ['./private/minorwire/**/*'],
    '/api/minorwire/download': ['./private/minorwire/**/*'],
    '/*': ['./private/minorwire/**/*'],
  },
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
