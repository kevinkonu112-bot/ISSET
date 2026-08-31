/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" }
    ]
  },
  eslint: { ignoreDuringBuilds: true },
  allowedDevOrigins: ["192.168.1.66:3000"]
};

module.exports = nextConfig;