/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript & ESLint errors fail the build in CI
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // next/image: allow external domains for product images and Unsplash placeholders
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.luminajewelry.com" },
      { protocol: "https", hostname: "assets.rapnet.com" },
      { protocol: "https", hostname: "certimages.gia.edu" },
      { protocol: "https", hostname: "certimages.igi-usa.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // Experimental: server components fetch cache (Next 14+)
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "ioredis"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: images.unsplash.com cdn.luminajewelry.com assets.rapnet.com certimages.gia.edu certimages.igi-usa.com",
              "connect-src 'self' *.stripe.com vitals.vercel-insights.com",
              "frame-src *.stripe.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Redirect legacy paths
  async redirects() {
    return [
      { source: "/rings", destination: "/engagement-rings", permanent: true },
      { source: "/lab-diamonds", destination: "/diamonds?origin=LAB_GROWN", permanent: true },
    ];
  },
};

module.exports = nextConfig;
