import { FooterCategory } from "@components/Footer";
import type { AuthorData } from "@utils/mdx";

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

/**
 * a list of blog file names
 */
export const blogRecommendations = [
    "welcome-to-v2",
    "fix-music-lag",
    "discord-bot-troubleshooting",
    "how-to-invite-bot"
];

export const blogAuthors: Record<string, AuthorData> = {
    kane: {
        name: "凱恩Kane",
        title: "YEE式機器龍作者",
        url: "https://github.com/Gary50613",
        image_url: "/blog/Gary50613.jpg",
    },
    wolf: {
        name: "Wolf yuan 狼苑",
        title: "黑貓音樂機器人作者 兼 機器人伺服器管理",
        url: "https://github.com/wolf-yuan-6115",
        image_url: "/blog/WolfYuan.png",
    },
    kay: {
        name: "美味的小圓 Kay Xue",
        title: "Yeecord 以前的小幫手",
        url: "https://github.com/Kayxue",
        image_url: "/blog/kay.jpg",
    },
    nathan: {
        name: "Nathan",
        title: "Yeecord 現任管理員 兼 ZeitFrei 合作機器人作者",
        url: "https://github.com/NathanTW0219",
        image_url: "/blog/nathan.jpg",
    },
    money: {
        name: "Money",
        title: "Yeecord 網站的前端工程師",
        url: "https://money-portfolio.vercel.app",
        image_url: "/blog/money.jpg",
    },
};
