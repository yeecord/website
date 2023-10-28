import { readFileSync } from "node:fs";
import createNextDocs from "next-docs-mdx/config";
import { rehypeImgSize } from "next-docs-zeta/mdx-plugins";

const withNextDocs = createNextDocs({
  rootMapPath: "./src/_map.ts",
  mdxOptions: {
    rehypePlugins: [[rehypeImgSize, { dir: "./public" }]],
  },
});

const redirectsFile = readFileSync("redirects.txt", "utf-8")
  .toString()
  .trim()
  .split("\n");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    webpackBuildWorker: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  redirects() {
    const redirects = redirectsFile.map((args) => {
      const [source, destination, permanent] = args.split(" ");

      return {
        source,
        destination,
        permanent: Boolean(permanent),
      };
    });

    for (const redirect of redirects) {
      if (!redirect.source.endsWith("/") && redirect.source.startsWith("/"))
        redirects.push({
          ...redirect,
          source: `${redirect.source}/`,
        });
    }

    return redirects;
  },
};

export default withNextDocs(nextConfig);
