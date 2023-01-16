/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    reactStrictMode: false,
    poweredByHeader: false,
    analyticsId: process.env.VERCEL_ANALYTICS_ID,
    images: {
        domains: ["cdn.discordapp.com"],
    },
    redirects() {
        return [
            {
                source: "/invite",
                destination: "https://app.yeecord.com/invite",
                permanent: false,
            },
            {
                source: "/docs/migrate-to-v4/",
                destination: "/docs/",
                permanent: true,
            },
        ];
    },
    i18n: {
        locales: ["zh-Hant-TW"],
        defaultLocale: "zh-Hant-TW",
    },
};

/** @type {import('nextra').NextraConfig} */
const nextraConfig = {
    theme: "@layout/index",
    themeConfig: "./theme.config.tsx",
    staticImage: true,
    defaultShowCopyCode: true,
    readingTime: true,
};

const withNextra = require("nextra")(nextraConfig);

module.exports = withNextra(nextConfig);
