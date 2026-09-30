import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'media.base44.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  turbopack: {
    resolveAlias: {
      'react-router-dom': './src/lib/next-router-compat.jsx',
    },
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(
      __dirname,
      'src/lib/next-router-compat.jsx'
    );
    return config;
  },
};

export default nextConfig;
