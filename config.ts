import { FooterCategory } from "@components/layout/Footer";

export const isProduction = process.env.NODE_ENV === "production";
export const API_ENDPOINT = isProduction
    ? "https://api.yeecord.com"
    : "http://127.0.0.1:3001";
export const CDN_ENDPOINT = "https://cdn.discordapp.com";

export const footer: FooterCategory[] = [
    {
        title: "連結",
        items: [
            {
                label: "部落格",
                href: "/blog/",
            },
            {
                label: "隱私權聲明",
                href: "/privacy/",
            },
            {
                label: "使用條款",
                href: "/terms/",
            },
        ],
    },
    {
        title: "支持我們",
        items: [
            {
                label: "GitHub",
                href: "https://github.com/yeecord",
                newWindow: true,
            },
            {
                label: "Patreon",
                href: "https://www.patreon.com/yeecord",
                newWindow: true,
            },
            {
                label: "top.gg",
                href: "https://top.gg/bot/584213384409382953",
                newWindow: true,
            },
        ],
    },
    {
        title: "其他",
        items: [
            {
                label: "控制面板",
                href: "https://app.yeecord.com",
                newWindow: true,
            },
            {
                label: "邀請機器人",
                href: "https://app.yeecord.com/invite",
                newWindow: true,
            },
            {
                label: "Discord",
                href: "https://discord.gg/yeecord",
                newWindow: true,
            },
        ],
    },
];
