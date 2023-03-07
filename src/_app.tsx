import { AppProps } from "next/app";
import { ReactElement } from "react";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AdsProvider } from "./adsense";

import Script from "next/script";

const noto = Inter({
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
      <Script
        src="https://betteruptime.com/widgets/announcement.js"
        data-id="156363"
        type="text/javascript"
        strategy="lazyOnload"
        async
      />
      <AdsProvider>
        <Component {...pageProps} />
      </AdsProvider>
    </>
  );
}
