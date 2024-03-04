import createMDX from "fumadocs-mdx/config";

const withMDX = createMDX({
  rootMapPath: "./src/_map.ts",
  rootContentPath: "./content",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    unoptimized: true,
  },
  output: "export",
};

export default withMDX(nextConfig);
