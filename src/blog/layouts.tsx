import {
  blogAuthors,
  canonicalUrl,
  domain,
  footer,
  type AuthorData,
} from "~/config";
import Link from "fumadocs-core/link";
import { DocsBody } from "fumadocs-ui/page";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { getPressContext } from "fumapress";
import type {
  BlogIndexPage,
  BlogLayout,
  BlogLayoutPage,
  BlogTagPage as BlogTagPageType,
  BlogTagsPage,
} from "fumapress/plugins/blog";
import { EyeIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import Footer from "~/components/Footer";
import { BlogItem, type BlogPost } from "~/components/blog/BlogItem";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/cn";
import { getTagHref } from "~/utils/tags";
import { contentPath, toLocale, type Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { baseOptions } from "~/layout-config";
import type { PressContext } from "../../press.config";

async function getBlogPages(lang?: string) {
  const ctx = getPressContext<PressContext>();
  const source = await ctx.getLoader();

  return source
    .getPages(lang)
    .filter((page): page is BlogPost => page.type === "blog")
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

async function renderBody(page: BlogPost): Promise<ReactNode> {
  const ctx = getPressContext<PressContext>();

  for (const adapter of ctx.adapters) {
    const body = await adapter["core:render-body"]?.call(ctx, page);
    if (body !== undefined) return body;
  }

  throw new Error(`[blog] no adapter can render ${page.url}`);
}

function Meta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
}) {
  return (
    <>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl(path)} />
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta
        property="og:image"
        content={image ?? `${domain}/opengraph-image.png`}
      />
    </>
  );
}

export const BlogSiteLayout: BlogLayout<PressContext> = ({ lang, children }) => {
  const locale = toLocale(lang);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="container mx-auto flex max-w-[1400px] flex-1 flex-col px-4">
        {children}
      </div>
      <Footer categories={footer(locale)} />
    </HomeLayout>
  );
};

export const BlogIndex: BlogIndexPage<PressContext> = async ({ lang }) => {
  const locale = toLocale(lang);
  const t = translator(locale);
  const pages = await getBlogPages(lang);

  return (
    <main className="flex flex-1 flex-col pb-20">
      <Meta
        title="Yeecord Blog"
        description="YEE 式機器龍各種用肝和 ❤️ 製作的部落格"
        path="/blog"
      />
      <div
        className="py-16"
        style={{
          backgroundImage:
            "linear-gradient(to bottom,transparent 50%,hsl(var(--background))), radial-gradient(circle at center, hsl(var(--muted-foreground)) 1px, hsl(var(--background)) 0)",
          backgroundSize: "100%, 1.5rem 1.5rem",
          backgroundRepeat: "no-repeat, round",
        }}
      >
        <h1 className="mb-8 text-center font-bold text-4xl md:text-5xl">
          {t("我們的部落格")}
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <Link
            href={contentPath(locale, "/blog/tags")}
            className={cn(buttonVariants({ color: "primary" }))}
          >
            <EyeIcon className="size-4" />
            {t("查看所有標籤")}
          </Link>
          <a
            href="https://github.com/yeecord/website"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants({ color: "secondary" }))}
          >
            {t("加入我們")}
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <BlogItem key={page.url} page={page} />
        ))}
      </div>
      <div className="mt-8 flex flex-row items-end gap-2 rounded-xl border bg-card p-4 shadow-lg">
        <div>
          <h2 className="mb-1 font-semibold">{t("關注我們的新貼文")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("立即訂閱我們的部落格")}
          </p>
        </div>
        <a
          href="/rss.xml"
          target="_blank"
          className={cn(
            buttonVariants({ color: "primary", className: "ml-auto" }),
          )}
          rel="noreferrer"
        >
          RSS
        </a>
      </div>
    </main>
  );
};

export const BlogPage: BlogLayoutPage<PressContext> = async ({
  page,
  lang,
}) => {
  if (page.type !== "blog") throw new Error("not a blog page");

  const locale = toLocale(lang);
  const body = await renderBody(page);
  const pages = await getBlogPages(lang);
  const index = pages.findIndex((entry) => entry.url === page.url);
  const newer = index > 0 ? pages[index - 1] : undefined;
  const older = index >= 0 ? pages[index + 1] : undefined;

  return (
    <main
      className="mx-auto w-full max-w-[800px] py-10 sm:py-20"
      itemType="http://schema.org/Article"
      itemScope
    >
      <Meta
        title={`${page.data.title} - Yeecord Blog`}
        description={page.data.description}
        path={page.url}
        image={`${domain}${page.url.replace(/\/$/, "")}.webp`}
      />
      <h1 className="mb-2 font-bold text-3xl leading-normal" itemProp="name">
        {page.data.title}
      </h1>
      <div className="mt-3 mb-6 flex flex-row flex-wrap items-center gap-1">
        <div className="flex flex-row flex-wrap gap-1">
          {page.data.authors
            .flatMap((author) => blogAuthors[author] ?? [])
            .map((author, i) => (
              <Fragment key={author.name}>
                {i !== 0 && <span className="mx-1">+</span>}
                <SmallAuthor author={author} />
              </Fragment>
            ))}
        </div>

        <p className="text-muted-foreground text-sm">
          <span className="mr-1">•</span>
          <span itemProp="datePublished">
            {page.data.date.toLocaleDateString("zh", { dateStyle: "long" })}
          </span>
        </p>
      </div>
      <DocsBody>{body}</DocsBody>
      <PostFooter page={page} locale={locale} />
      <AdjacentPosts locale={locale} newer={newer} older={older} />
    </main>
  );
};

function AdjacentPosts({
  locale,
  newer,
  older,
}: {
  locale: Locale;
  newer?: BlogPost;
  older?: BlogPost;
}) {
  const t = translator(locale);

  if (!newer && !older) return null;

  return (
    <nav className="mt-6 grid gap-3 sm:grid-cols-2">
      {[
        [newer, t("上一篇")] as const,
        [older, t("下一篇")] as const,
      ].map(([target, label]) =>
        target ? (
          <Link
            key={label}
            href={target.url}
            className="flex flex-col gap-1 rounded-xl border bg-card p-4 text-card-foreground transition-colors last:text-right hover:bg-accent"
          >
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="font-medium">{target.data.title}</span>
          </Link>
        ) : (
          <span key={label} />
        ),
      )}
    </nav>
  );
}

function AuthorLink({
  author,
  className,
  itemProp,
  children,
}: {
  author: AuthorData;
  className: string;
  itemProp?: string;
  children: ReactNode;
}) {
  if (author.url == null)
    return (
      <span className={className} itemProp={itemProp}>
        {children}
      </span>
    );

  return (
    <a
      className={className}
      href={author.url}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp={itemProp}
    >
      {children}
    </a>
  );
}

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <AuthorLink
      author={author}
      className="flex flex-row items-center gap-1.5 text-foreground"
      itemProp="author"
    >
      {author.image_url != null && (
        <img
          alt={author.name}
          src={author.image_url}
          width={25}
          height={25}
          loading="lazy"
          className="h-full rounded-full"
        />
      )}
      {author.name}
    </AuthorLink>
  );
}

function PostFooter({ page, locale }: { page: BlogPost; locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="mt-20 flex flex-col gap-6">
      <div className="flex flex-row flex-wrap gap-2 text-base">
        <p>{t("標籤")}</p>
        {page.data.tags.map((tag) => (
          <Link
            key={tag}
            href={getTagHref(locale, tag)}
            className="rounded-md bg-primary/10 px-1 py-0.5 text-primary text-sm"
          >
            # {tag}
          </Link>
        ))}
      </div>
      {page.data.authors
        .flatMap((author) => blogAuthors[author] ?? [])
        .map((author) => (
          <AuthorLink
            key={author.name}
            author={author}
            className="flex flex-row gap-2 rounded-xl bg-card p-4 text-card-foreground"
          >
            {author.image_url != null && (
              <img
                itemProp="image"
                alt={author.name}
                src={author.image_url}
                width={40}
                height={40}
                loading="lazy"
                className="h-full rounded-full"
              />
            )}
            <div>
              <p itemProp="name" className="font-medium">
                {author.name}
              </p>
              <p itemProp="jobTitle" className="text-muted-foreground text-sm">
                {author.title}
              </p>
            </div>
          </AuthorLink>
        ))}
    </div>
  );
}

export const BlogTags: BlogTagsPage<PressContext> = async ({ lang }) => {
  const locale = toLocale(lang);
  const t = translator(locale);
  const pages = await getBlogPages(lang);
  const tags = new Map<string, number>();

  for (const page of pages) {
    for (const tag of page.data.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }

  const sorted = [...tags.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <main className="my-16 flex w-full flex-col gap-3">
      <Meta title="所有標籤 - Yeecord Blog" path="/blog/tags" />
      <div className="mb-3 flex flex-col items-center gap-3 text-center">
        <h1 className="mb-4 font-bold text-5xl">{t("所有標籤")}</h1>
        <Link
          href={contentPath(locale, "/blog")}
          className={cn(buttonVariants({ color: "primary" }))}
        >
          {t("查看文章")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={getTagHref(locale, tag)}
            className="flex flex-row justify-between gap-3 rounded-md border bg-card p-2 text-card-foreground"
          >
            <span className="font-medium">{tag}</span>
            <span className="text-muted-foreground text-sm">{count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
};

export const BlogTagPage: BlogTagPageType<PressContext> = async ({
  tag,
  lang,
}) => {
  const locale = toLocale(lang);
  const t = translator(locale);
  const decodedTag = decodeURIComponent(tag);
  const pages = (await getBlogPages(lang)).filter((page) =>
    page.data.tags.some((entry) => entry.toLowerCase() === decodedTag),
  );
  const heading = t("帶有「{tag}」標籤的文章").replace("{tag}", decodedTag);

  return (
    <main className="my-16 flex w-full flex-1 flex-col gap-5">
      <Meta title={`${heading} - Yeecord Blog`} path={`/blog/tags/${tag}`} />
      <div className="mb-5 flex flex-col items-center gap-5 text-center">
        <h1 className="mb-4 font-bold text-3xl">{heading}</h1>

        <Link
          href={contentPath(locale, "/blog/tags")}
          className={cn(buttonVariants({ color: "primary" }))}
        >
          {t("所有標籤")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <BlogItem key={page.url} page={page} />
        ))}
      </div>
    </main>
  );
};
