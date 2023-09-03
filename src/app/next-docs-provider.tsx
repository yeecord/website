"use client";
import { I18nProvider } from "next-docs-ui/i18n";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { GithubIcon } from "lucide-react";
import { Nav } from "next-docs-ui/components";
import { RootProvider } from "next-docs-ui/provider";

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
          lastUpdate: "最後更新於",
        },
      }}
    >
      <RootProvider>
        <Nav
          enableSidebar={pathname === "/docs" || pathname.startsWith("/docs/")}
          title={
            <span className="inline-flex items-center gap-2 text-lg font-bold">
              <svg width="24" height="24" viewBox="0 0 128 128">
                <path
                  d="M43.3522 25.2578C52.946 9.29013 72.5335 4.51549 81.128 4.12413C85.15 3.46785 94.7859 5.5398 99 7.38145C103.214 9.22311 107.699 10.3815 114.5 18.8815C121.301 27.3815 123 41.8815 123 51.8815C123 61.8815 118.222 77.4108 109.31 84.5494C107.413 86.0689 103.482 87.3457 98.5168 88.4495V115.881C98.5168 120.3 94.9351 123.881 90.5168 123.881H57.3483C52.9301 123.881 49.3483 120.3 49.3483 115.881V94.9799C35.5571 94.9799 23.5649 92.768 17.5687 89.8328C11.5725 86.8976 1.97863 78.6789 4.37712 65.1769C6.85518 51.2269 23.5648 46.9785 33.1587 48.7396C33.7583 46.3914 33.7583 41.2254 43.3522 25.2578Z"
                  fill="currentColor"
                />
              </svg>
              Yeecord
            </span>
          }
          links={[
            {
              href: "https://github.com/yeecord",
              label: "Github",
              icon: <GithubIcon className="h-5 w-5" />,
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
        />
        {children}
      </RootProvider>
    </I18nProvider>
  );
}
