/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s12arquitetura.com.br" },
      { protocol: "https", hostname: "www.theglobeandmail.com" },
      { protocol: "https", hostname: "cdn.avenuehq.com" },
      { protocol: "https", hostname: "remax-whistler.com" },
      { protocol: "https", hostname: "houseandhome.com" },
    ],
  },
};

export default nextConfig;
