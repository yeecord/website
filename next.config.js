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
            {
                source: "/i",
                destination: "https://app.yeecord.com/invite",
                permanent: false
            },
            {
                source: "/link",
                destination: "https://app.yeecord.com/invite",
                permanent: false
            },
            {
                source: "/discord",
                destination: "https://discord.gg/yeecord",
                permanent: false
            },
            {
                source: "/support",
                destination: "https://discord.gg/yeecord",
                permanent: false
            },
            {
                source: "/tos",
                destination: "/terms",
                permanent: false
            },
            {
                source: "topgg",
                destination: "https://top.gg/bot/584213384409382953",
                permanent: false
            },
            {
                source: "dst",
                destination: "https://discordservers.tw/bots/584213384409382953",
                permanent: false
            },
            {
                source: "/docs/intro",
                destination: "/docs/",
                permanent: true
            },
            {
                source: "/rules",
                destination: "https://hackmd.io/@yeecord/HJtapIa55",
                permanent: false
            },
            {
                source: "/github",
                destination: "https://github.com/yeecord/docs",
                permanent: false
            }
        ];
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
