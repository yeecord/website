import type { FooterCategory } from "@/components/Footer";

// CF Pages 的 preview build（非 master）部署在 next.yeecord.com，
// og:image / canonical 這些絕對網址要跟著指過去，不然會指到 yeecord.com 上不存在的路徑
export const domain =
  process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "master"
    ? "https://next.yeecord.com"
    : "https://yeecord.com";

// Cloudflare Pages 對目錄頁一律 308 到帶斜線網址，canonical 必須指向最終網址
export function canonicalUrl(path: string) {
  return `${domain}${path.endsWith("/") ? path : `${path}/`}`;
}

export const footer: FooterCategory[] = [
  {
    title: "連結",
    items: [
      {
        label: "部落格",
        href: "/zh-tw/blog/",
      },
      {
        label: "隱私權聲明",
        href: "/zh-tw/privacy/",
      },
      {
        label: "使用條款",
        href: "/zh-tw/terms/",
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
        href: "/invite",
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

export const blogAuthors: Record<string, AuthorData> = {
  kane: {
    name: "Kane Wang",
    title: "YEE 式機器龍作者",
    url: "https://bento.me/kanewang",
    image_url: "/blog/kane50613.jpg",
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

export type AuthorData = {
  name: string;
  url?: string;
  title?: string;
  image_url?: string;
};
