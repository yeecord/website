const {readFileSync} = require("fs")

const redirectsFile = readFileSync("redirects.txt", "utf-8").toString().trim().split("\n")

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    reactStrictMode: false,
    poweredByHeader: false,
    analyticsId: process.env.VERCEL_ANALYTICS_ID,
    redirects() {
        const redirects = redirectsFile.map(args => {
            const [source, destination, permanent] = args.split(" ")
            
            return {
                source,
                destination,
                permanent: Boolean(permanent)
            }
        })
        
        for(const redirect of redirects) {
            if(!redirect.source.endsWith("/") && redirect.source.startsWith("/"))
                redirects.push({
                    ...redirect,
                    source: `${redirect.source}/`
                })
        }
        
        return redirects
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
