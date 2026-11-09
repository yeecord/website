import { blogPlugin } from "@fumapress/blog";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import mdxPlugin from "fumadocs-mdx/press";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  createPress,
  type HeadTag,
  recommendedPreset,
  selectTreeRoot,
} from "fumapress";
import wasmModule from "takumi-js/wasm";
import { blogAuthors, canonicalUrl, domain } from "~/config";
import { blog, docs, legal } from "./.source/server";
import {
  BlogIndex,
  BlogPostPage,
  BlogShell,
  BlogTagPage,
  BlogTags,
} from "./src/blog/layouts";
import { localeMdxComponents, mdxComponents } from "./src/components/mdx";
import { createCmd } from "./src/components/mdx/cmd";
import { createCommandHeader } from "./src/components/mdx/command-header";
import {
  defaultLocale,
  i18n,
  localeCodes,
  locales,
  toLocale,
  translations,
} from "./src/i18n";
import { baseOptions } from "./src/layout-config";
import { LegalPage } from "./src/legal-layout";
import { staticPageLinks } from "./src/localized-page";
import { localizedPagesPlugin } from "./src/localized-pages-plugin";
import { BlogOgImage, OgImage, ogFonts } from "./src/og-image";
import { ogPlugin } from "./src/og-plugin";
import { searchPlugin } from "./src/search-plugin";
import { sidebarCommandsPlugin } from "./src/sidebar-commands";

const siteHead: HeadTag[] = [
  {
    tag: "meta",
    attrs: { name: "twitter:card", content: "summary_large_image" },
  },
  { tag: "meta", attrs: { property: "og:site_name", content: "Yeecord" } },
  { tag: "link", attrs: { rel: "icon", href: "/favicon.ico", sizes: "any" } },
  { tag: "link", attrs: { rel: "apple-touch-icon", href: "/apple-icon.png" } },
  {
    tag: "link",
    attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
  },
  {
    tag: "link",
    attrs: {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
  },
  {
    tag: "link",
    attrs: {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Geist:wght@400..800&family=Noto+Sans+TC:wght@400;500;700&family=Chiron+GoRound+TC:wght@500;800&display=swap",
    },
  },
];

const titleSuffixes: Partial<Record<string, string>> = {
  blog: " - Yeecord Blog",
  legal: " - Yeecord",
};

export const app = createPress(
  {
    docs: docs.toFumadocsSource({ baseDir: "docs" }),
    blog: blog.toFumadocsSource({ baseDir: "blog" }),
    legal: legal.toFumadocsSource(),
  },
  {
    i18n,
    loaderPlugins: [lucideIconsPlugin(), sidebarCommandsPlugin()],
  },
).plugins(
  mdxPlugin({
    components(page) {
      const locale = toLocale(page.locale);

      return {
        ...defaultMdxComponents,
        ...mdxComponents,
        ...localeMdxComponents(locale),
        Cmd: createCmd(locale),
        CommandHeader: createCommandHeader(locale, page.slugs.at(-1)),
      };
    },
  }),
  searchPlugin(),
  localizedPagesPlugin(),
  ogPlugin(),
  blogPlugin({ source: "blog" }),
);

export default app.config({
  preset: recommendedPreset({
    search: false,
    sitemap: {
      getEntry(page) {
        return { loc: canonicalUrl(page.url), priority: 0.8 };
      },
    },
    rss: {
      title: "Yeecord Blog",
      description: "Welcome to Yeecord Blog",
      language: defaultLocale,
      getItem(page) {
        if (page.type !== "blog" || page.locale !== defaultLocale) {
          return;
        }

        return {
          title: page.data.title,
          description: page.data.description,
          link: `${domain}${page.url}`,
          pubDate: page.data.date,
          categories: page.data.tags,
        };
      },
    },
    ogImage: {
      options: { fonts: ogFonts, module: wasmModule },
      getImage(page) {
        if (page.type === "blog") {
          return {
            node: (
              <BlogOgImage
                title={page.data.title}
                date={page.data.date}
                authors={page.data.authors.map(
                  (author) => blogAuthors[author]?.name ?? author,
                )}
              />
            ),
          };
        }

        return {
          node: (
            <OgImage
              title={page.data.title}
              description={page.data.description}
            />
          ),
        };
      },
    },
  }),
  site: {
    name: "Yeecord",
    baseUrl: domain,
    hreflang: Object.fromEntries(
      localeCodes.map((locale) => [locale, locales[locale].hreflang]),
    ),
    git: {
      user: "yeecord",
      repo: "website",
      branch: "master",
    },
  },
  head({ page, path }) {
    if (page) {
      const suffix = page.type && titleSuffixes[page.type];

      if (!suffix) {
        return [];
      }

      const title = `${page.data.title}${suffix}`;

      return [
        { tag: "title", children: title },
        { tag: "meta", attrs: { property: "og:title", content: title } },
      ];
    }

    if (path !== undefined) {
      return staticPageLinks(path);
    }

    return siteHead;
  },
  ui: {
    translations,
    layoutProps({ lang }) {
      return baseOptions(toLocale(lang));
    },
    providerProps: {
      theme: { hotKey: false },
    },
    renderPage(props) {
      const { renderDefault } = props;
      const locale = toLocale(props.lang);

      switch (props.type) {
        case "docs":
          return renderDefault({
            layoutProps: {
              tree: selectTreeRoot(props.layoutProps.tree, "docs"),
              sidebar: { defaultOpenLevel: 1 },
            },
          });
        case "legal":
          return <LegalPage locale={locale} body={props.body} />;
        case "blog":
          return (
            <BlogShell locale={locale}>
              <BlogPostPage
                locale={locale}
                post={props.post}
                newer={props.newer}
                older={props.older}
                body={props.body}
              />
            </BlogShell>
          );
        case "blog.index":
          return (
            <BlogShell locale={locale}>
              <BlogIndex locale={locale} posts={props.posts} />
            </BlogShell>
          );
        case "blog.tags":
          return (
            <BlogShell locale={locale}>
              <BlogTags locale={locale} tags={props.tags} />
            </BlogShell>
          );
        case "blog.tag":
          return (
            <BlogShell locale={locale}>
              <BlogTagPage
                locale={locale}
                tag={props.tag}
                posts={props.posts}
              />
            </BlogShell>
          );
        default:
          return renderDefault();
      }
    },
  },
});
