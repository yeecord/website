import Footer from "@components/Footer";
import LoginButton from "@components/LoginButton";
import Image from "next/image";
import Link from "next/link";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { footer } from "./config";
import { useRouter } from "next/router";
import { ThemeToggle } from "@components/ThemeToggle";
import { SafeLink } from "@components/SafeLink";

const config: Partial<DocsThemeConfig> = {
    components: {
        a: (props) => (
            <SafeLink
                {...props}
                className="text-link underline decoration-from-font [text-underline-position:from-font]"
            />
        ),
    },
    head: Head,
    logo: (
        <div className="flex flex-row gap-2 items-center justify-center">
            <Image
                alt="YEE式機器龍"
                src="/img/logo_128x128.png"
                width={32}
                height={32}
                style={{
                    borderRadius: "50%",
                }}
            />
            <p className="text-xl tracking-wider">Yeecord</p>
        </div>
    ),
    search: {
        placeholder: "搜尋文檔",
    },
    useNextSeoProps() {
        const { asPath } = useRouter();
        const { frontMatter, title } = useConfig();

        const image = frontMatter.image != null && {
            alt: title,
            url: frontMatter.image,
        };

        const description =
            frontMatter.description ??
            "YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間";

        return {
            canonical: `https://yeecord.com${asPath}`,
            titleTemplate: "%s – YEE式機器龍",
            twitter: {
                cardType: "summary_large_image",
            },
            description: description,
            openGraph: {
                description: description,
                type: "website",
                images: [
                    image || {
                        url: "/img/branding.png",
                        alt: "YEE式機器龍",
                    },
                ],
            },
        };
    },
    docsRepositoryBase: "https://github.com/yeecord/website/blob/master",
    navbar: {
        extraContent: (
            <div className="flex flex-row gap-3">
                <ThemeToggle />
                <Link
                    href="https://app.yeecord.com/"
                    className="hidden md:block"
                >
                    <LoginButton />
                </Link>
            </div>
        ),
    },
    footer: {
        component: <Footer categories={footer} />,
    },
    project: {
        link: "https://github.com/yeecord",
    },
    feedback: {
        content: "有疑問？給我們反饋 →",
    },
    toc: {
        title: "目錄",
        extraContent: <></>,
    },
    editLink: {
        text: "在 Github 上編輯此頁面 →",
    },
    sidebar: {
        titleComponent({ title, type }) {
            if (type === "separator") {
                return <span className="cursor-default text-xl">{title}</span>;
            }
            return <>{title}</>;
        },
    },
    banner: {
        key: "new-year",
        text: <span>🎊 新年快樂！</span>,
    },
    gitTimestamp: ({ timestamp }) => {
        return (
            <p className="text-lg">
                最後更新於 {timestamp.toLocaleDateString()}
            </p>
        );
    },
};

function Head() {
    return (
        <>
            <link rel="shortcut icon" href="/img/logo_128x128.png" />
        </>
    );
}

export default config;
