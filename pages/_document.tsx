import { Head, Html, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import React from "react";

export default function Document() {
    return (
        <Html lang="zh">
            <Head>
                <Script
                    async
                    defer
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
                    crossOrigin="anonymous"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
                <Analytics />
            </body>
        </Html>
    );
}
