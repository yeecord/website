import type { FooterCategory, FooterItem } from "~/components/Footer";
import { contentPath, type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";

// master 目前部署在 next.yeecord.com（legacy branch 佔著 yeecord.com），
// 正式切換主站時把這裡改回 https://yeecord.com
export const domain = "https://next.yeecord.com";

// Workers static assets 設 drop-trailing-slash，帶斜線網址一律 308 到無斜線，
// canonical 必須指向最終網址
export function canonicalUrl(path: string) {
  const clean =
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

  return `${domain}${clean}`;
}

const supportItems: FooterItem[] = [
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
];

export function footer(locale: Locale): FooterCategory[] {
  const t = translator(locale);

  return [
    {
      title: t("連結"),
      items: [
        { label: t("部落格"), href: contentPath(locale, "/blog/") },
        { label: t("隱私權聲明"), href: contentPath(locale, "/privacy/") },
        { label: t("使用條款"), href: contentPath(locale, "/terms/") },
      ],
    },
    {
      title: t("支持我們"),
      items: supportItems,
    },
    {
      title: t("其他"),
      items: [
        { label: t("安裝機器人"), href: staticPath(locale, "/install") },
        {
          label: "Discord",
          href: "https://discord.gg/yeecord",
          newWindow: true,
        },
        {
          label: t("服務狀態"),
          href: "https://status.yeecord.com/",
          newWindow: true,
        },
      ],
    },
  ];
}

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
