import createMDX from "fumadocs-mdx/config";

const withMDX = createMDX({
  rootMapPath: "./src/_map.ts",
  rootContentPath: "./content",
  buildSearchIndex: {
    filter: (path) => {
      return path.startsWith("docs");
    },
  },
});

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
