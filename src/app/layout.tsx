import { Noto_Sans_TC } from "next/font/google";
import { AdsProvider } from "@/adsense";
import Script from "next/script";
import type { ReactNode } from "react";
import { RootProvider } from "next-docs-ui/provider";

import { NextDocsProvider } from "./next-docs-provider";
import Footer from "@/components/Footer";
import { footer } from "@config";
import type { Metadata } from "next";

import "next-docs-ui/style.css";
import "./global.css";

const noto = Noto_Sans_TC({
  preload: true,
  weight: "400",
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
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={noto.className}>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <AdsProvider>
            <NextDocsProvider>{children}</NextDocsProvider>
            <Footer categories={footer} />
          </AdsProvider>
        </RootProvider>
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
