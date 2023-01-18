import { AppProps } from "next/app";
import { ReactElement } from "react";
import "nextra-theme-docs/style.css";
import "react-tooltip/dist/react-tooltip.css";
import "../styles/global.css";
import { Noto_Sans_TC } from "@next/font/google";
import { AdsenseContextProvider } from "../lib/context/adsense";

export const noto = Noto_Sans_TC({
    weight: ["500", "700"],
    variable: "--font-noto",
    display: "swap",
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
    return (
        <AdsenseContextProvider>
            <style jsx global>{`
                html {
                    --font-noto: ${noto.style.fontFamily};
                }
            `}</style>
            <Component {...pageProps} />;
        </AdsenseContextProvider>
    );
}
