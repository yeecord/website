import type { WakuAppShape, WakuPlugin } from "fumapress";
import type { FC } from "react";
import { HomePage } from "~/home/page";
import { type Locale, localeCodes } from "~/i18n";
import { InstallCustomPage } from "~/install/custom";
import { InstallPage } from "~/install/page";

/** Static pages that exist in every language. The default language is served from src/pages, the rest are generated here. */
const pages = [
  { path: "/", component: HomePage },
  { path: "/install", component: InstallPage },
  { path: "/install/custom", component: InstallCustomPage },
] as const satisfies readonly {
  path: string;
  component: FC<{ locale: Locale }>;
}[];

// The default language is served from src/pages at the bare path and keeps a
// prefixed copy so the built-in language switch, which only swaps the first
// segment, lands on a real route; _redirects sends hard requests for it back to
// the bare path.
export function localizedPagesPlugin<C extends WakuAppShape>(): WakuPlugin<C> {
  return {
    name: "localized-pages",
    waku: {
      createPages({ createPage }) {
        for (const locale of localeCodes) {
          for (const { path, component: Page } of pages) {
            createPage({
              render: "static",
              path,
              lang: locale,
              component: () => <Page locale={locale} />,
            });
          }
        }
      },
    },
  };
}
