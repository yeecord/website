import { canonicalUrl, domain } from "@config";
import type { ReactNode } from "react";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { createLayoutSwitchAuto } from "fumapress/layouts/switch";
import { blogPlugin } from "fumapress/plugins/blog";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { googleFonts } from "takumi-js/helpers";
import wasmModule from "takumi-js/wasm";
import { blog, docs, legal } from "./.source/server";
import {
  BlogIndex,
  BlogPage,
  BlogSiteLayout,
  BlogTagPage,
  BlogTags,
} from "./src/blog/layouts";
import { mdxComponents } from "./src/components/mdx";
import { createCmd } from "./src/components/mdx/cmd";
import { createCommandHeader } from "./src/components/mdx/command-header";
import { i18n, RootLayout, translations } from "./src/root-layout";
import { baseOptions, cnBaseOptions } from "./src/layout-config";
import { LegalPage } from "./src/legal-layout";
import { OgImage } from "./src/og-image";
import { rssPlugin } from "./src/rss-plugin";
import { searchPlugin } from "./src/search-plugin";

// 側欄頁面對應的斜線指令，slug 即指令名；一頁多指令的（utility）不標
const sidebarCommands = new Set([
  "poll",
  "auto-role",
  "role-menu",
  "form",
  "giveaway",
  "auto-channels",
  "lock-channel",
  "member-notification",
  "ticket",
  "clear",
  "bot-fight",
  "lol",
  "find-food",
]);

function withCommandBadges<T extends { type: string }>(items: T[]): T[] {
  return items.map((item) => {
    if (item.type === "folder" && "children" in item)
      return {
        ...item,
        children: withCommandBadges(item.children as { type: string }[]),
      };

    if (item.type === "page" && "url" in item && "name" in item) {
      const slug = String(item.url).replace(/\/$/, "").split("/").at(-1);

      if (slug && sidebarCommands.has(slug))
        return {
          ...item,
          name: (
            <>
              {item.name as ReactNode}
              <code className="ms-auto rounded bg-fd-muted px-1.5 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
                /{slug}
              </code>
            </>
          ),
        };
    }

    return item;
  });
}

const config = defineConfig({
  mode: "static",
  i18n,
  content: {
    docs: docs.toFumadocsSource({ baseDir: "docs" }),
    blog: blog.toFumadocsSource({ baseDir: "blog" }),
    legal: legal.toFumadocsSource(),
  },
  site: {
    name: "Yeecord",
    baseUrl: domain,
    git: {
      user: "yeecord",
      repo: "website",
      branch: "master",
    },
  },
  meta: {
    root() {
      return (
        <>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Yeecord" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-icon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          />
        </>
      );
    },
    page(page) {
      const slugs = page.url.replace(/^\/(zh-tw|zh-cn)(?=\/|$)/, "");

      return (
        <>
          <link rel="canonical" href={canonicalUrl(page.url)} />
          {page.data.description && (
            <meta name="description" content={page.data.description} />
          )}
          <link
            rel="alternate"
            hrefLang="zh-Hant"
            href={canonicalUrl(`/zh-tw${slugs}`)}
          />
          <link
            rel="alternate"
            hrefLang="zh-Hans"
            href={canonicalUrl(`/zh-cn${slugs}`)}
          />
          <link
            rel="alternate"
            hrefLang="x-default"
            href={canonicalUrl(`/zh-tw${slugs}`)}
          />
        </>
      );
    },
  },
  translations,
})
  .adapters(
    fumadocsMdx({
      async getMdxComponents(page) {
        const source = await this.getLoader();

        return {
          ...defaultMdxComponents,
          ...mdxComponents,
          Cmd: createCmd(page.locale === "zh-cn" ? "cn" : "tw"),
          CommandHeader: createCommandHeader(
            page.locale === "zh-cn" ? "cn" : "tw",
            page.slugs.at(-1),
          ),
          a: createRelativeLink(source, page),
        };
      },
    }),
  )
  .plugins(
    searchPlugin(),
    sitemapPlugin({
      getEntry(page) {
        return { loc: canonicalUrl(page.url), priority: 0.8 };
      },
    }),
    llmsPlugin(),
    takumiPlugin({
      generate(page) {
        return {
          node: (
            <OgImage
              title={page.data.title}
              description={page.data.description}
            />
          ),
          options: {
            fonts: googleFonts([
              { name: "Manrope", weight: [500, 800] },
              { name: "Noto Sans TC", weight: [400, 500, 800] },
              { name: "Noto Sans SC", weight: [400, 500, 800] },
            ]),
            module: wasmModule,
          },
        };
      },
    }),
  );

export type PressContext = typeof config.$context;

export default config
  .plugins(
    rssPlugin(),
    blogPlugin({
      layouts: {
        layout: BlogSiteLayout,
        index: BlogIndex,
        page: BlogPage,
        tags: BlogTags,
        tag: BlogTagPage,
      },
    }),
  )
  .layouts({
    root: RootLayout,
    defaultProps({ lang }) {
      return lang === "zh-cn" ? cnBaseOptions : baseOptions;
    },
    page: createLayoutSwitchAuto({
      docs: createDocsLayoutPage({
        async render(page) {
          const source = await this.getLoader();
          const tree = source.getPageTree(page.locale ?? i18n.defaultLanguage);
          const docsFolder = tree.children.find(
            (child) =>
              child.type === "folder" && child.$id?.split(":").at(-1) === "docs",
          );

          return {
            layoutProps: {
              tree:
                docsFolder?.type === "folder"
                  ? { ...tree, children: withCommandBadges(docsFolder.children) }
                  : tree,
              sidebar: { defaultOpenLevel: 1 },
            },
          };
        },
      }),
      legal: LegalPage,
      blog: () => null,
    }),
  });
