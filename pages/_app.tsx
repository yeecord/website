import { AppProps } from "next/app";
import { ReactElement, useState } from "react";
import { Noto_Sans_TC } from "@next/font/google";
import { AdsenseContext } from "@ads/adsense";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "nextra-theme-docs/style.css";
import "../styles/global.css";

// TODO: reworking on font?
export const noto = Noto_Sans_TC({
    weight: ["500"],
    variable: "--font-noto",
    display: "swap",
    subsets: ["latin"],
});

export const notoHeading = Noto_Sans_TC({
    weight: ["700"],
    variable: "--font-noto-heading",
    display: "swap",
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
    // this will cause the whole page being rerendered
    // TODO: replace with global states using libraries
    const [status, setAdsStatus] = useState<"ok" | "error">("ok");

    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
                crossOrigin="anonymous"
                strategy="afterInteractive"
                onError={() => setAdsStatus("error")}
            />
            <Analytics />
            <style jsx global>{`
                html {
                    overflow-x: hidden;
                    --font-noto: ${noto.style.fontFamily};
                    --font-noto-heading: ${notoHeading.style.fontFamily};
                }
            `}</style>
            <AdsenseContext.Provider
                value={{
                    status,
                }}
            >
                <Component {...pageProps} />
            </AdsenseContext.Provider>
        </>
    );
}
