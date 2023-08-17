import { Noto_Sans_HK } from "next/font/google";
import { AdsProvider } from "@/src/adsense";
import Script from "next/script";
import type { ReactNode } from "react";
import { RootProvider } from "next-docs-ui/provider";

import "next-docs-ui/style.css";
import "./global.css";
import { tree } from "./source";
import { DocsLayoutWrapper } from "./docs-layout";
import clsx from "clsx";
import Footer from "@components/Footer";
import { footer } from "@/config";

const noto = Noto_Sans_HK({
  preload: true,
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={clsx(noto.className)}>
      <body className="overflow-x-clip">
        <RootProvider>
          <AdsProvider>
            <DocsLayoutWrapper tree={tree}>{children}</DocsLayoutWrapper>
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
