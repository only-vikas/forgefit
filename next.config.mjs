/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turned off to prevent excessive GSAP/Three.js double-fires in dev, leading to a smoother DX.
  output: 'standalone', // Standalone mode for lightweight Docker/Vercel serverless functions
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizeCss: true, // Improves LCP
  },
};

export default nextConfig;
