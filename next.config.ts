import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server vía Cloudflare Tunnel (HMR, fuentes, assets)
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pxiqcjddkuzfntdgmxar.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/noticias",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/noticias/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
