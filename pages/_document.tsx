import { Head, Html, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import React from "react";

export default function Document() {
    return (
        <Html lang="zh">
            <Head />
            <body>
                <Main />
                <NextScript />
                <Analytics />
            </body>
        </Html>
    );
}
