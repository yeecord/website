import { blogAuthors, domain, footer } from "@config";
import { defineTranslations } from "fumadocs-core/i18n";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { generate as generateOgNode } from "fumadocs-ui/og/takumi";
import { i18nProvider, uiTranslations } from "fumadocs-ui/i18n";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { createRootLayout } from "fumapress/layouts/root";
import { createLayoutSwitchAuto } from "fumapress/layouts/switch";
import { blogPlugin } from "fumapress/plugins/blog";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
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
import SearchDialog from "./src/components/search-dialog";
import { baseOptions } from "./src/layout-config";
import { LegalPage } from "./src/legal-layout";
import { rssPlugin } from "./src/rss-plugin";

const translations = defineTranslations()
  .extend(uiTranslations())
  .add({
    "On this page(table of contents)": "目錄",
    "Search(search dialog)": "搜尋文檔",
    "Search(search trigger)": "搜尋文檔",
    "Last updated on(page footer)": "最後更新於",
    "No results found(search dialog)": "沒有結果",
    "Previous Page(pagination)": "上一頁",
    "Next Page(pagination)": "下一頁",
    "No Headings(table of contents)": "沒有子標題",
    "Edit on GitHub(edit page)": "在 Github 上編輯此頁面",
    "Page Not Found(404 not found page)": "找不到頁面",
    "Back to Home(404 not found page)": "返回主頁",
  });

const config = defineConfig({
  mode: "static",
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
          a: createRelativeLink(source, page),
        };
      },
    }),
  )
  .plugins(
    oramaSearchPlugin(),
    sitemapPlugin(),
    llmsPlugin(),
    takumiPlugin({
      generate(page) {
        return {
          node: generateOgNode({
            title: page.data.title,
            description: page.data.description,
            primaryColor: "hsla(145, 65%, 55%, 0.3)",
            primaryTextColor: "#4ade80",
            site: "Yeecord",
          }),
          options: {
            fonts: googleFonts([{ name: "Noto Sans TC", weight: [600, 800] }]),
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
    root: createRootLayout({
      providerProps: {
        i18n: i18nProvider(translations.extend(uiTranslations())),
        search: {
          SearchDialog,
        },
      },
    }),
    defaultProps() {
      return baseOptions;
    },
    page: createLayoutSwitchAuto({
      docs: createDocsLayoutPage({
        async render() {
          const source = await this.getLoader();
          let tree = source.getPageTree(this.lang);

          for (const child of tree.children) {
            if (child.type === "folder" && child.$id === "docs") {
              tree = { ...tree, children: child.children };
            }
          }

          return {
            layoutProps: {
              tree,
              sidebar: { defaultOpenLevel: 1 },
            },
          };
        },
      }),
      legal: LegalPage,
      blog: () => null,
    }),
  });
