import createNextDocs from "next-docs-mdx/config";
import { rehypeImgSize } from "next-docs-zeta/mdx-plugins";

const withNextDocs = createNextDocs({
  rootMapPath: "./src/_map.ts",
  rootContentPath: "./content",
  mdxOptions: {
    rehypePlugins: [[rehypeImgSize, { dir: "./public" }]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
};

export default withNextDocs(nextConfig);
