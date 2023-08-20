"use client";
import { I18nProvider } from "next-docs-ui/i18n";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { Nav } from "next-docs-ui/components";

export function NextDocsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <I18nProvider
      value={{
        locale: "zh-Hant",
        onChange: () => {},
        text: {
          toc: "目錄",
          footerNext: "下一頁",
          footerPrevious: "上一頁",
          light: "淺色主題",
          dark: "黑暗主題",
          system: "系統默認",
          search: "搜索文檔",
        },
      }}
    >
      <Nav
        enableSidebar={pathname === "/docs" || pathname.startsWith("/docs/")}
        links={[
          {
            href: "https://github.com/yeecord",
            icon: <GithubIcon aria-label="Github" />,
            external: true,
          },
        ]}
        items={[
          {
            href: "/docs",
            children: "使用教學",
          },
          {
            href: "/blog",
            children: "部落格",
          },
          {
            href: "https://app.yeecord.com",
            children: "網頁面板",
            external: true,
          },
        ]}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-bold transition-colors hover:text-muted-foreground"
        >
          <svg width="28" height="28" viewBox="0 0 128 128">
            <path
              d="M96 11.5C91.7859 9.65835 82.15 7.5864 78.128 8.24268C69.5335 8.63404 49.946 13.4087 40.3522 29.3763C30.7583 45.344 30.7583 50.51 30.1587 52.8582C20.5648 51.097 3.85518 55.3455 1.37712 69.2954C-1.02137 82.7975 8.57252 91.0161 14.5687 93.9513C20.5649 96.8866 32.5571 99.0984 46.3483 99.0984M96 11.5C100.214 13.3417 107 15.5 111.5 23M96 11.5C100.5 10.3333 110.1 9.2 112.5 14C114.9 18.8 112.833 22 111.5 23M111.5 23C116 30.5 116.127 37.099 116.889 41.1172M111.5 23C111.5 23 120 22 122 29C124 36 116.889 41.1172 116.889 41.1172M116.889 41.1172C117.37 43.6529 117.698 46.2097 117.916 48.7488L118.301 59.1003M116.889 41.1172C116.889 41.1172 127.5 42.5 127 49.5C126.5 56.5 118.301 59.1003 118.301 59.1003M118.301 59.1003C118.247 72.4498 115.222 81.5293 106.31 88.6679C104.413 90.1875 100.482 91.4642 95.5168 92.568M95.5168 92.568V128M95.5168 92.568L46.3483 99.0984M46.3483 99.0984V128"
              stroke="currentColor"
              strokeWidth={6}
            />
          </svg>
          Yeecord
        </Link>
      </Nav>
      {children}
    </I18nProvider>
  );
}
