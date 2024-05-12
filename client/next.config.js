/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // specify dirs to include spec
    dirs: ["pages", "app", "components", "lib", "src", "spec"],
  },
  output: 'standalone',
};

module.exports = nextConfig;
