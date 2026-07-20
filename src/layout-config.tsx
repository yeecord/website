import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  BookIcon,
  ExternalLinkIcon,
  LayoutListIcon,
  TerminalIcon,
  UtensilsIcon,
} from "lucide-react";

const discordIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

export const baseOptions = {
  githubUrl: "https://github.com/yeecord",
  nav: {
    url: "/",
    title: (
      <>
        <svg width="24" height="24" viewBox="0 0 128 128">
          <title>Yeecord</title>
          <path
            d="M43.3522 25.2578C52.946 9.29013 72.5335 4.51549 81.128 4.12413C85.15 3.46785 94.7859 5.5398 99 7.38145C103.214 9.22311 107.699 10.3815 114.5 18.8815C121.301 27.3815 123 41.8815 123 51.8815C123 61.8815 118.222 77.4108 109.31 84.5494C107.413 86.0689 103.482 87.3457 98.5168 88.4495V115.881C98.5168 120.3 94.9351 123.881 90.5168 123.881H57.3483C52.9301 123.881 49.3483 120.3 49.3483 115.881V94.9799C35.5571 94.9799 23.5649 92.768 17.5687 89.8328C11.5725 86.8976 1.97863 78.6789 4.37712 65.1769C6.85518 51.2269 23.5648 46.9785 33.1587 48.7396C33.7583 46.3914 33.7583 41.2254 43.3522 25.2578Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-bold text-lg">Yeecord</span>
      </>
    ),
  },
  links: [
    {
      url: "/docs",
      text: "使用教學",
      type: "menu",
      items: [
        {
          icon: <BookIcon />,
          url: "/docs",
          text: "快速入門",
          description:
            "YEE 式機器龍是一隻全中文的 Discord 機器人，邀請、安裝到帳號的方法都在這",
        },
        {
          url: "/docs/commands",
          icon: <TerminalIcon />,
          text: "指令總覽",
          description: "投票、抽獎、動態語音等所有指令的用法",
        },
        {
          icon: <UtensilsIcon />,
          url: "/docs/find-food",
          text: "找吃的",
          description: "陪 Yee 出門覓食、煮一桌、餵牠的放置型小遊戲",
        },
      ],
    },
    {
      url: "/blog",
      icon: <LayoutListIcon />,
      text: "部落格",
      active: "nested-url",
    },
    {
      url: "https://app.yeecord.com",
      icon: <ExternalLinkIcon />,
      text: "網頁面板",
      external: true,
    },
    {
      type: "icon",
      url: "https://discord.gg/yeecord",
      text: "Discord",
      icon: discordIcon,
      external: true,
    },
  ],
} satisfies BaseLayoutProps;

export const cnBaseOptions = {
  ...baseOptions,
  links: [
    {
      url: "/zh-cn/docs",
      text: "使用教程",
      type: "menu",
      items: [
        {
          icon: <BookIcon />,
          url: "/zh-cn/docs",
          text: "快速上手",
          description:
            "YEE 式机器龙是一只全中文的 Discord 机器人，邀请、安装到账号的方法都在这",
        },
        {
          url: "/zh-cn/docs/commands",
          icon: <TerminalIcon />,
          text: "命令总览",
          description: "投票、抽奖、动态语音等所有命令的用法",
        },
        {
          icon: <UtensilsIcon />,
          url: "/zh-cn/docs/find-food",
          text: "找吃的",
          description: "陪 Yee 出门觅食、煮一桌、喂它的放置型小游戏",
        },
      ],
    },
    {
      url: "/blog",
      icon: <LayoutListIcon />,
      text: "博客",
      active: "nested-url",
    },
    {
      url: "https://app.yeecord.com",
      icon: <ExternalLinkIcon />,
      text: "网页面板",
      external: true,
    },
    {
      type: "icon",
      url: "https://discord.gg/yeecord",
      text: "Discord",
      icon: discordIcon,
      external: true,
    },
  ],
} satisfies BaseLayoutProps;
