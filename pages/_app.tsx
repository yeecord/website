import { AppProps } from "next/app";
import { ReactElement } from "react";
import "../styles/global.css";
import "nextra-theme-docs/style.css";
import "react-tooltip/dist/react-tooltip.css";

export default function App({ Component, pageProps }: AppProps): ReactElement {
    return <Component {...pageProps} />;
}
