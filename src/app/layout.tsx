import { AdsProvider } from "@/components/adsense";
import { urlBase } from "@config";
import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";
import { Provider } from "@/app/layout.client";

const noto = Noto_Sans_TC({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Yeecord - %s",
    default: "Yeecord - 萬中選一的 Discord 機器人",
  },
  description:
    "YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: "/opengraph-image.png",
    title: {
      template: "Yeecord - %s",
      default: "Yeecord - 萬中選一的 Discord 機器人",
    },
    description:
      "YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間",
  },
  metadataBase: urlBase,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW" className={noto.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <AdsProvider>
          <Provider
            i18n={{
              locale: "cn",
              translations: {
                toc: "目錄",
                search: "搜尋文檔",
                lastUpdate: "最後更新於",
                searchNoResult: "沒有結果",
                previousPage: "上一頁",
                nextPage: "下一頁",
                chooseTheme: "選擇外觀主題",
                tocNoHeadings: "沒有子標題",
                editOnGithub: "在 Github 上編輯此頁面",
              },
            }}
          >
            {children}
          </Provider>
        </AdsProvider>
      </body>
    </html>
  );
}
