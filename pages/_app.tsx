import { AppProps } from "next/app";
import { ReactElement } from "react";
import { Inter } from "@next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { useAdsenseStore } from "@ads/adsense";

import "nextra-theme-docs/style.css";
import "../styles/global.css";

export const noto = Inter({
    variable: "--font-noto",
    preload: true,
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
    const setEnabled = useAdsenseStore((state) => state.setEnabled);

    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
                crossOrigin="anonymous"
                strategy="lazyOnload"
                onError={() => setEnabled(false)}
            />
            <Analytics />
            <style jsx global>{`
                html {
                    --font-noto: ${noto.style.fontFamily};
                }
            `}</style>
            <Component {...pageProps} />
        </>
    );
}
