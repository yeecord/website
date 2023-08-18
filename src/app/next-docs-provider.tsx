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
        ]}
      >
        <Link
          href="/"
          className="text-lg font-bold transition-colors hover:text-muted-foreground"
        >
          Yeecord
        </Link>
      </Nav>
      {children}
    </I18nProvider>
  );
}
