const { readFileSync } = require("fs");

const redirectsFile = readFileSync("redirects.txt", "utf-8")
  .toString()
  .trim()
  .split("\n");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer(nextConfig);
