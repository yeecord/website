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
          src="https://a.yeecord.com/script.js"
          data-website-id="27e8ff22-0917-4feb-bda6-8af777989ba2"
          strategy="afterInteractive"
        />
      )}
      <AdsProvider>
        <Component {...pageProps} />
      </AdsProvider>
    </>
  );
}
