import { blogAuthors, canonicalUrl, domain } from "~/config";
import type { ReactNode } from "react";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { createLayoutSwitchAuto } from "fumapress/layouts/switch";
import { blogPlugin } from "fumapress/plugins/blog";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { rssPlugin } from "fumapress/plugins/rss";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import wasmModule from "takumi-js/wasm";
import { blog, docs, legal } from "./.source/server";
import {
  BlogIndex,
  BlogPage,
  BlogSiteLayout,
  BlogTagPage,
  BlogTags,
} from "./src/blog/layouts";
import { localeMdxComponents, mdxComponents } from "./src/components/mdx";
import { createCmd } from "./src/components/mdx/cmd";
import { createCommandHeader } from "./src/components/mdx/command-header";
import { defaultLocale, i18n, localeCodes, locales, toLocale } from "./src/i18n";
import { RootLayout, translations } from "./src/root-layout";
import { baseOptions } from "./src/layout-config";
import { LegalPage } from "./src/legal-layout";
import { BlogOgImage, OgImage, ogFonts } from "./src/og-image";
import { ogPlugin } from "./src/og-plugin";
import { searchPlugin } from "./src/search-plugin";
import { localizedPagesPlugin } from "./src/localized-pages-plugin";

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
  loaderOptions: {
    plugins: [lucideIconsPlugin()],
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
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400..800&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          />
        </>
      );
    },
    page(page) {
      const slugs = page.url.replace(/^\/[a-z-]+(?=\/|$)/, "");

      return (
        <>
          <link rel="canonical" href={canonicalUrl(page.url)} />
          {/* the docs, blog and legal pages have no English version yet, so /en
              falls back to chinese content and must stay out of the index */}
          {page.locale === "en" && <meta name="robots" content="noindex" />}
          {page.data.description && (
            <meta name="description" content={page.data.description} />
          )}
          {localeCodes
            .filter((locale) => locale !== "en")
            .map((locale) => (
              <link
                key={locale}
                rel="alternate"
                hrefLang={locales[locale].hreflang}
                href={canonicalUrl(`/${locale}${slugs}`)}
              />
            ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={canonicalUrl(`/${defaultLocale}${slugs}`)}
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
        const locale = toLocale(page.locale);

        return {
          ...defaultMdxComponents,
          ...mdxComponents,
          ...localeMdxComponents(locale),
          Cmd: createCmd(locale),
          CommandHeader: createCommandHeader(locale, page.slugs.at(-1)),
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
        const node =
          page.type === "blog" ? (
            <BlogOgImage
              title={page.data.title}
              date={page.data.date}
              authors={page.data.authors.map(
                (author) => blogAuthors[author]?.name ?? author,
              )}
            />
          ) : (
            <OgImage
              title={page.data.title}
              description={page.data.description}
            />
          );

        return {
          node,
          options: {
            fonts: ogFonts,
            module: wasmModule,
          },
        };
      },
    }),
  );

export type PressContext = typeof config.$context;

export default config
  .plugins(
    localizedPagesPlugin(),
    ogPlugin(),
    rssPlugin({
      title: "Yeecord Blog",
      description: "Welcome to Yeecord Blog",
      language: defaultLocale,
      getItem(page) {
        if (page.type !== "blog" || page.locale !== defaultLocale) return;

        return {
          title: page.data.title,
          description: page.data.description,
          link: `${domain}${page.url}`,
          pubDate: page.data.date,
          author: page.data.authors
            .map((author) => blogAuthors[author]?.name ?? author)
            .join(", "),
          categories: page.data.tags,
        };
      },
    }),
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
      return baseOptions(toLocale(lang));
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
