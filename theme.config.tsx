import Image from "next/image";
import { DocsThemeConfig, useTheme } from "nextra-theme-docs";
import { useEffect, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

function ThemeToggle() {
  const [current, setCurrent] = useState<"light" | "dark" | undefined>(
    undefined
  );
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme != undefined)
      setCurrent(resolvedTheme as "light" | "dark");
  }, [resolvedTheme]);

  return (
    <button
      aria-label="toggle dark mode"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      {current === "dark" ? <BsMoonFill /> : <BsFillSunFill />}
    </button>
  );
}

const config: DocsThemeConfig = {
  head: (
    <>
      <link rel="shortcut icon" href="/logo_128x128.png" />
    </>
  ),
  logo: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        alt="logo"
        src="/logo_128x128.png"
        width={30}
        height={30}
        style={{
          borderRadius: "100%",
        }}
      />
      <strong>Yeecord</strong>
    </div>
  ),
  search: {
    placeholder: "搜尋文檔",
  },
  useNextSeoProps: () => {
    return {
      titleTemplate: "%s – Yeecord",
      twitter: {
        cardType: "summary_large_image",
      },
      openGraph: {
        siteName: "YEE式機器龍",
        type: "website",
        images: [
          {
            url: "/blog/branding.png",
            alt: "YEEEEE",
          },
        ],
      },
    };
  },
  navbar: {
    extraContent: <ThemeToggle />,
  },
  footer: {
    text: "Yeecord",
  },
  project: {
    link: "https://github.com/yeecord",
  },
  i18n: [{ locale: "zh", text: "繁體中文" }],
  feedback: {
    content: "有疑問？給我們反饋 →",
  },
  toc: {
    title: "目錄",
  },
  editLink: {
    text: "在 github 上編輯此頁面 →",
  },
  banner: {
    key: "new-year",
    text: <a>🎉 2023 新年快樂</a>,
  },
  gitTimestamp: ({ timestamp }) => {
    return (
      <p className="text-lg">最後更新於 {timestamp.toLocaleDateString()}</p>
    );
  },
};

export default config;
