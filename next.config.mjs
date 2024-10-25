import {createMDX} from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  output: "export",
};

export default withMDX(nextConfig);
