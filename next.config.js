const {readFileSync} = require("fs")

const redirectsFile = readFileSync("redirects.txt", "utf-8").toString().trim().split("\n")

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
        return redirectsFile.map(args => {
            const [source, destination, permanent] = args.split(" ")
            
            return {
                source,
                destination,
                permanent: Boolean(permanent)
            }
        })
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
