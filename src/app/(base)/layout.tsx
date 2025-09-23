import { footer } from "@config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { BookIcon, SwordIcon, TerminalIcon } from "lucide-react";
import type { ReactNode } from "react";
import { layoutProps } from "@/app/layout.shared";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...layoutProps}
      links={[
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
                "YEE 式機器龍是一隻全中文化的 Discord 機器人，我們提供了許多簡單且快速的整合性服務，讓您不需要再四處尋找中文的機器人",
            },
            {
              url: "/docs/commands",
              icon: <TerminalIcon />,
              text: "指令",
              description: "使用 YEE 式機器龍的指令",
            },
            {
              icon: <SwordIcon />,
              url: "/docs/rpg",
              text: "RPG 總覽",
              description:
                "將 Discord 變身成一個有趣的遊樂場！結合了工作、捕魚、商店、寵物、結婚等系統，讓你的 Discord 更有趣！",
            },
          ],
        },
        ...layoutProps.links,
      ]}
    >
      {children}
      <Footer categories={footer} />
    </HomeLayout>
  );
}
