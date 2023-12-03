import type { FooterCategory } from "@/components/Footer";
import type { AuthorData } from "@/types";

export const urlBase = new URL(
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000",
);

export const domain = "https://yeecord.com";

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
        label: "Twitter",
        href: "https://twitter.com/yeecord",
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
      {
        label: "服務狀態",
        href: "https://status.yeecord.com/",
        newWindow: true,
      },
    ],
  },
];

/**
 * a list of blog file names
 */
export const blogRecommendations = [
  "welcome-to-v3",
  "fix-music-lag",
  "discord-bot-troubleshooting",
  "how-to-invite-bot",
];

export const blogAuthors: Record<string, AuthorData> = {
  kane: {
    name: "Kane Wang",
    title: "YEE式機器龍作者",
    url: "https://bento.me/kanewang",
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
    url: "https://github.com/Nat1anWasTaken/",
    image_url: "/blog/nathan.jpg",
  },
  money: {
    name: "Fuma",
    title: "Yeecord 網站的前端工程師",
    url: "https://fuma-dev.vercel.app",
    image_url: "/blog/money.jpg",
  },
  taipei: {
    name: "Taipei101",
    title: "Yeecord 網路工程師 兼 台北 101 網路股份有限公司創始人",
    url: "https://taipei101.xyz",
    image_url: "/blog/taipei.jpg",
  },
};
