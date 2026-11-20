import type { WakuAppShape, WakuPlugin } from "fumapress";
import type { FC } from "react";
import { DashboardPage } from "~/dashboard/page";
import { HomePage } from "~/home/page";
import { type Locale, localeCodes } from "~/i18n";
import { InstallPage } from "~/install/page";
import { LoginPage } from "~/login/page";

/** Static pages that exist in every language. The default language is served from src/pages, the rest are generated here. */
const pages = [
  { path: "/", component: HomePage },
  { path: "/install", component: InstallPage },
  { path: "/dashboard", component: DashboardPage, noindex: true },
  { path: "/login", component: LoginPage, noindex: true },
] as const satisfies readonly {
  path: string;
  component: FC<{ locale: Locale }>;
  noindex?: true;
}[];

/** `path` without its language prefix, as `pages` lists it. */
function unprefixed(path: string) {
  const [, first = "", ...rest] = path.split("/");

  return localeCodes.some((code) => code === first) ? `/${rest.join("/")}` : path;
}

// The default language is served from src/pages at the bare path and keeps a
// prefixed copy so the built-in language switch, which only swaps the first
// segment, lands on a real route; _redirects sends hard requests for it back to
// the bare path.
export function localizedPagesPlugin<C extends WakuAppShape>(): WakuPlugin<C> {
  return {
    name: "localized-pages",
    // Read by core's head and sitemap, so these pages carry `noindex` and stay out of the sitemap.
    transformPage(_data, env) {
      const page = env.path && pages.find((page) => page.path === unprefixed(env.path ?? ""));

      return page && "noindex" in page ? { noindex: page.noindex } : undefined;
    },
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
