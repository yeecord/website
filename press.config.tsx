import { canonicalUrl, domain } from "@config";
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
import { i18n, RootLayout, translations } from "./src/root-layout";
import { baseOptions, cnBaseOptions } from "./src/layout-config";
import { LegalPage } from "./src/legal-layout";
import { OgImage } from "./src/og-image";
import { defaultLocalePlugin } from "./src/default-locale-plugin";
import { rssPlugin } from "./src/rss-plugin";
import { searchPlugin } from "./src/search-plugin";

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
    page(page) {
      return (
        <>
          <link rel="canonical" href={canonicalUrl(page.url)} />
          {page.data.description && (
            <meta name="description" content={page.data.description} />
          )}
        </>
      );
    },
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
          Cmd: createCmd(page.locale === "cn" ? "cn" : "tw"),
          a: createRelativeLink(source, page),
        };
      },
    }),
  )
  .plugins(
    defaultLocalePlugin(),
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
              { name: "Noto Sans TC", weight: [400, 600, 800] },
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
      return lang === "cn" ? cnBaseOptions : baseOptions;
    },
    page: createLayoutSwitchAuto({
      docs: createDocsLayoutPage({
        async render(page) {
          const source = await this.getLoader();
          let tree = source.getPageTree(page.locale ?? i18n.defaultLanguage);

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
