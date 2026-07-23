import {
  blogAuthors,
  canonicalUrl,
  domain,
  footer,
  type AuthorData,
} from "@config";
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
import Footer from "@/components/Footer";
import { BlogItem, type BlogPost } from "@/components/blog/BlogItem";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { getTagHref } from "@/utils/tags";
import { baseOptions } from "@/layout-config";
import type { PressContext } from "../../press.config";

async function getBlogPages() {
  const ctx = getPressContext<PressContext>();
  const source = await ctx.getLoader();

  return source
    .getPages()
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

export const BlogSiteLayout: BlogLayout<PressContext> = ({ children }) => {
  return (
    <HomeLayout {...baseOptions}>
      <div className="container mx-auto flex max-w-[1400px] flex-1 flex-col px-4">
        {children}
      </div>
      <Footer categories={footer} />
    </HomeLayout>
  );
};

export const BlogIndex: BlogIndexPage<PressContext> = async () => {
  const pages = await getBlogPages();

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
          我們的部落格
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <Link
            href="/zh-tw/blog/tags"
            className={cn(buttonVariants({ color: "primary" }))}
          >
            <EyeIcon className="size-4" />
            查看所有標籤
          </Link>
          <a
            href="https://github.com/yeecord/website"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants({ color: "secondary" }))}
          >
            加入我們
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
          <h2 className="mb-1 font-semibold">關注我們的新貼文</h2>
          <p className="text-muted-foreground text-sm">立即訂閱我們的部落格</p>
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

export const BlogPage: BlogLayoutPage<PressContext> = async ({ page }) => {
  if (page.type !== "blog") throw new Error("not a blog page");

  const body = await renderBody(page);

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
      <PostFooter page={page} />
    </main>
  );
};

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <a
      className="flex flex-row items-center gap-1.5 text-foreground"
      href={author.url ?? "#"}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp="author"
    >
      {author.image_url != null && (
        <img
          alt="avatar"
          src={author.image_url}
          width={25}
          height={25}
          className="h-full rounded-full"
        />
      )}
      {author.name}
    </a>
  );
}

function PostFooter({ page }: { page: BlogPost }) {
  return (
    <div className="mt-20 flex flex-col gap-6">
      <div className="flex flex-row flex-wrap gap-2 text-base">
        <p>標籤</p>
        {page.data.tags.map((tag) => (
          <Link
            key={tag}
            href={getTagHref(tag)}
            className="rounded-md bg-primary/10 px-1 py-0.5 text-primary text-sm"
          >
            # {tag}
          </Link>
        ))}
      </div>
      {page.data.authors
        .flatMap((author) => blogAuthors[author] ?? [])
        .map((author) => (
          <a
            key={author.name}
            className="flex flex-row gap-2 rounded-xl bg-card p-4 text-card-foreground"
            href={author.url ?? "#"}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {author.image_url != null && (
              <img
                itemProp="image"
                alt="avatar"
                src={author.image_url}
                width={40}
                height={40}
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
          </a>
        ))}
    </div>
  );
}

export const BlogTags: BlogTagsPage<PressContext> = async () => {
  const pages = await getBlogPages();
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
        <h1 className="mb-4 font-bold text-5xl">所有標籤</h1>
        <Link href="/zh-tw/blog" className={cn(buttonVariants({ color: "primary" }))}>
          查看文章
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={getTagHref(tag)}
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

export const BlogTagPage: BlogTagPageType<PressContext> = async ({ tag }) => {
  const decodedTag = decodeURIComponent(tag);
  const pages = (await getBlogPages()).filter((page) =>
    page.data.tags.some((t) => t.toLowerCase() === decodedTag),
  );

  return (
    <main className="my-16 flex w-full flex-1 flex-col gap-5">
      <Meta
        title={`帶有「${decodedTag}」標籤的文章 - Yeecord Blog`}
        path={`/blog/tags/${tag}`}
      />
      <div className="mb-5 flex flex-col items-center gap-5 text-center">
        <h1 className="mb-4 font-bold text-3xl">{`帶有「${decodedTag}」標籤的文章`}</h1>

        <Link
          href="/zh-tw/blog/tags"
          className={cn(buttonVariants({ color: "primary" }))}
        >
          所有標籤
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
