import { type AppProps } from "next/app";
import { type ReactElement } from "react";
import { Inter } from "next/font/google";
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
      <style jsx global>{`
        html {
          --font-noto: ${noto.style.fontFamily};
        }
      `}</style>
      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src="https://analytics.trycatchcloud.host/script.js"
          data-website-id="d5e1c212-34bc-4766-afae-2edb2fb0c87b"
          strategy="afterInteractive"
        />
      )}
      <AdsProvider>
        <Component {...pageProps} />
      </AdsProvider>
    </>
  );
}
