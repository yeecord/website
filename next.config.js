/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ["cdn.discordapp.com"],
  },
  async redirects() {
    return [
      {
        source: "/invite",
        destination: "https://app.yeecord.com/invite",
        permanent: false,
      },
    ];
  },
};

/** @type {import('nextra').NextraConfig} */
const nextraConfig = {
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  defaultShowCopyCode: true,
  readingTime: true,
  i18n: {
    locales: ["zh"],
    defaultLocale: "zh",
  },
};

const withNextra = require("nextra")(nextraConfig);

module.exports = withNextra(nextConfig);
