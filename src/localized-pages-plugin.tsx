import type { ServerPlugin } from "fumapress";
import type { FC, ReactNode } from "react";
import { HomePage } from "~/home/page";
import { type Locale, localeCodes } from "~/i18n";
import { InstallPage } from "~/install/page";
import { RootLayout } from "~/root-layout";
import type { PressContext } from "../press.config";

/**
 * Static pages that exist in every language. The default language is served from
 * src/pages, the rest are generated here. `as const` keeps the paths literal,
 * which is what waku needs to tell a static route from one with a [slug].
 */
const pages = [
  { path: "", component: HomePage },
  { path: "/install", component: InstallPage },
] as const satisfies readonly {
  path: string;
  component: FC<{ locale: Locale }>;
}[];

// src/pages shares a single root layout across every autoI18n: false page, and
// that layout cannot tell which path it renders for. Registering the prefixed
// routes here gives each language its own <html lang>. The default language is
// served from src/pages at the bare path and keeps a prefixed copy so the
// built-in language switch, which only swaps the first segment, lands on a real
// route; _redirects sends hard requests for it back to the bare path.
export function localizedPagesPlugin(): ServerPlugin<PressContext> {
  return {
    name: "localized-pages",
    createPages({ createPage, createLayout }) {
      for (const locale of localeCodes) {
        createLayout({
          render: "static",
          path: `/${locale}`,
          component: ({ children }: { children: ReactNode }) => (
            <RootLayout lang={locale}>{children}</RootLayout>
          ),
        });

        for (const { path, component: Page } of pages)
          createPage({
            render: "static",
            path: `/${locale}${path}`,
            component: () => <Page locale={locale} />,
          });
      }
    },
  };
}
