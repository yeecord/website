import { FooterCategory } from "@components/layout/Footer";

export const footer: FooterCategory[] = [
    {
        title: "連結",
        items: [
            {
                label: "入門",
                href: "/docs/",
            },
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
                label: "邀請機器人",
                href: "https://app.yeecord.com/invite",
                newWindow: true,
            },
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
        title: "社群",
        items: [
            {
                label: "Discord",
                href: "https://discord.gg/yeecord",
                newWindow: true,
            },
        ],
    },
];
