import createMDX from "fumadocs-mdx/config";
import nextBuildId from "next-build-id";

const withMDX = createMDX({
  rootMapPath: "./src/_map.ts",
  rootContentPath: "./content",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  generateBuildId: () => {
    const id = nextBuildId.sync({ dir: process.cwd() });

    process.env.NEXT_BUILD_ID = id;
    return id;
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  output: "export",
};

export default withMDX(nextConfig);
