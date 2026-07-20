import type { ServerPlugin } from "fumapress";
import type { ReactNode } from "react";
import type { PressContext } from "../press.config";
import {
  BlogIndex,
  BlogSiteLayout,
  BlogTagPage,
  BlogTags,
} from "@/blog/layouts";
import { i18n, RootLayout } from "@/root-layout";

// fumapress 的 i18n 路由把所有語言都放在 /[lang] 下，但 loader 的 hideLocale
// 讓預設語系的連結沒有前綴，這裡把預設語系的頁面補鋪回根路徑
// TODO: 上游支援 hideLocale 後移除 https://github.com/fuma-nama/fumapress
export function defaultLocalePlugin(): ServerPlugin<PressContext> {
  const lang = i18n.defaultLanguage;

  return {
    name: "default-locale-pages",
    async createPages({ createPage }) {
      const context = this;
      const loader = await context.getLoader();
      const staticPaths: string[][] = [];

      for (const page of loader.getPages(lang)) {
        staticPaths.push(page.slugs);
      }

      createPage({
        render: "static",
        path: "/[...slugs]",
        staticPaths,
        async component({ slugs }: { slugs: string[] }) {
          const page = loader.getPage(slugs, lang);

          if (!page) throw new Error(`Page not found: /${slugs.join("/")}`);

          let fallback: ReactNode = (
            <context.layouts.page lang={lang} slugs={slugs} page={page} />
          );

          for (const plugin of context.plugins) {
            if (!plugin.renderPage) continue;

            const rendered: ReactNode = await plugin.renderPage.call(context, {
              fallback,
              page,
              slugs,
              lang,
            });

            if (rendered !== undefined) fallback = rendered;
          }

          return <RootLayout lang={lang}>{fallback}</RootLayout>;
        },
      });

      // blogPlugin 的 index / tags 頁在 i18n 下也只掛在 /[lang] 底下
      function blogShell(children: ReactNode) {
        return (
          <RootLayout lang={lang}>
            <BlogSiteLayout lang={lang}>{children}</BlogSiteLayout>
          </RootLayout>
        );
      }

      createPage({
        render: "static",
        path: "/blog",
        component: () => blogShell(<BlogIndex lang={lang} />),
      });

      const tags = new Set<string>();

      for (const page of loader.getPages(lang)) {
        if (page.slugs[0] !== "blog") continue;

        for (const tag of (page.data as { tags?: string[] }).tags ?? [])
          tags.add(encodeURIComponent(tag.toLowerCase()));
      }

      createPage({
        render: "static",
        path: "/blog/tags",
        component: () => blogShell(<BlogTags lang={lang} />),
      });

      createPage({
        render: "static",
        path: "/blog/tags/[tag]",
        staticPaths: [...tags],
        component: ({ tag }: { tag: string }) =>
          blogShell(<BlogTagPage lang={lang} tag={tag} />),
      });
    },
  };
}
