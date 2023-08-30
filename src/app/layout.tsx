import { Noto_Sans_TC } from "next/font/google";
import { AdsProvider } from "@/adsense";
import Script from "next/script";
import type { ReactNode } from "react";

import { NextDocsProvider } from "./next-docs-provider";
import Footer from "@/components/Footer";
import { footer, url_base } from "@config";
import type { Metadata } from "next";

import "next-docs-ui/style.css";
import "./global.css";

const noto = Noto_Sans_TC({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Yeecord - %s",
    default: "Yeecord",
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
      default: "Yeecord",
    },
    description:
      "YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間",
  },
  metadataBase: url_base,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={noto.className}>
      <body className="flex min-h-screen flex-col">
        <AdsProvider>
          <NextDocsProvider>
            {children}
            <Footer categories={footer} />
          </NextDocsProvider>
        </AdsProvider>
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src="https://a.yeecord.com/script.js"
            data-website-id="27e8ff22-0917-4feb-bda6-8af777989ba2"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
