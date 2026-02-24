import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.glsl': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    // GLSL shader imports (fallback for webpack builds)
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    })
    return config
  },
  transpilePackages: ['three'],
};

export default nextConfig;
