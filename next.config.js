/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  };
  return {
    async redirects() {
      return [
        {
          source: "/",
          destination: "/expedientes",
          permanent: true,
        },
      ];
    },
    rewrites,
    experimental: {
      appDir: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
};

module.exports = nextConfig;
