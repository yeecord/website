"use client";
import { DocsLayout } from "next-docs-ui/layout";
import { I18nProvider } from "next-docs-ui/i18n";
import type { PageTree } from "next-docs-zeta/server";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function DocsLayoutWrapper({
  tree,
  children,
}: {
  tree: PageTree;
  children: ReactNode;
}) {
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
      <DocsLayout
        tree={tree}
        githubUrl="https://github.com/yeecord"
        navItems={[
          {
            href: "/docs",
            children: "使用教學",
          },
          {
            href: "/blog",
            children: "部落格",
          },
        ]}
        sidebar={
          pathname === "/docs" || pathname.startsWith("/docs/")
            ? undefined
            : false
        }
        navTitle="Yeecord"
      >
        {children}
      </DocsLayout>
    </I18nProvider>
  );
}
