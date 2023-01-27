import { AppProps } from "next/app";
import { ReactElement } from "react";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AdsProvider } from "@ads/adsense";

import "nextra-theme-docs/style.css";
import "../styles/global.css";

export const noto = Inter({
  variable: "--font-noto",
  preload: true,
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Analytics />
      <style jsx global>{`
        html {
          --font-noto: ${noto.style.fontFamily};
        }
      `}</style>
      <AdsProvider>
        <Component {...pageProps} />
      </AdsProvider>
    </>
  );
}
