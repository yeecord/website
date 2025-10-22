import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    unoptimized: true,
  },
  output: "export",
  outputFileTracingRoot: import.meta.dirname,
};

export default withMDX(nextConfig);
