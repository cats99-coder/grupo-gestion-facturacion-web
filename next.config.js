/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: "/api",
        destination: "http://localhost:3001",
      },
    ];
  };
  return {
    rewrites,
    experimental: {
      appDir: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};

module.exports = nextConfig;
