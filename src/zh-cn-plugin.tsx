import type { ServerPlugin } from "fumapress";
import type { ReactNode } from "react";
import { HomePage } from "@/home/page";
import { InstallPage } from "@/install/page";
import { RootLayout } from "@/root-layout";
import type { PressContext } from "../press.config";

// src/pages shares a single root layout across every autoI18n: false page, so the
// zh-cn versions are registered outside it to get their own <html lang>
export function zhCnPagesPlugin(): ServerPlugin<PressContext> {
  return {
    name: "zh-cn-pages",
    createPages({ createPage, createLayout }) {
      createLayout({
        render: "static",
        path: "/zh-cn",
        component: ({ children }: { children: ReactNode }) => (
          <RootLayout lang="zh-cn">{children}</RootLayout>
        ),
      });
      createPage({
        render: "static",
        path: "/zh-cn",
        component: () => <HomePage locale="zh-cn" />,
      });
      createPage({
        render: "static",
        path: "/zh-cn/install",
        component: () => <InstallPage locale="zh-cn" />,
      });
    },
  };
}
