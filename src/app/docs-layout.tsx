"use client";
import { DocsLayout } from "next-docs-ui/layout";
import { I18nProvider } from "next-docs-ui/i18n";
import type { PageTree } from "next-docs-zeta/server";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { BookIcon, LayoutListIcon, Undo2Icon } from "lucide-react";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";

const itemVariants = cva(
  "inline-flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground",
  {
    variants: {
      active: {
        true: "font-medium text-primary",
        false: "",
      },
    },
  },
);
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
        sidebarBanner={
          <>
            <Link
              href="/"
              className="mb-4 inline-flex flex-row gap-2 px-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Undo2Icon className="h-5 w-5" /> 返回主頁
            </Link>
            <div className="mb-4 flex flex-col lg:hidden">
              <Link
                href="/docs"
                className={cn(
                  itemVariants({
                    active: true,
                  }),
                )}
              >
                <BookIcon className="h-5 w-5" />
                使用教學
              </Link>
              <Link href="/blog" className={cn(itemVariants())}>
                <LayoutListIcon className="h-5 w-5" />
                部落格
              </Link>
            </div>
          </>
        }
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
        sidebar={pathname === "/docs" || pathname.startsWith("/docs/")}
        navTitle="Yeecord"
      >
        {children}
      </DocsLayout>
    </I18nProvider>
  );
}
