/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
