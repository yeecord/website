import { BlogItem, LargeBlogItem } from "@/components/blog/BlogItem";
import { EyeIcon } from "lucide-react";
import { blogRecommendations, domain } from "@config";
import { BlogRecommend } from "@/components/blog/BlogRecommend";
import type { Metadata } from "next";
import { blog } from "@/app/source";
import type { InferPageType } from "fumadocs-core/source";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  alternates: {
    canonical: `${domain}/blog`,
  },
};

export default function BlogIndex() {
  const pages = blog
    .getPages()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const recommendations = blogRecommendations.flatMap((name) => {
    return pages.find((page) => page.slugs[0] === name) ?? [];
  });

  return (
    <main className="mb-20 flex flex-1 flex-col gap-5">
      <div className="mb-5 mt-16">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
          我們的部落格
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <Link
            href="/blog/tags"
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
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            加入我們
          </a>
        </div>
      </div>

      <Recommendations items={recommendations} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <h2 className="text-4xl font-bold max-sm:text-center sm:ml-5">
          新文章
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          return <BlogItem key={page.url} page={page} />;
        })}
      </div>
    </main>
  );
}

function Recommendations({ items }: { items: InferPageType<typeof blog>[] }) {
  return (
    <div className="mb-16 grid grid-cols-1 gap-8 min-[816px]:grid-cols-2">
      {items[0] != null && <LargeBlogItem page={items[0]} />}
      <div className="max-md:-ml-3">
        <h2 className="mb-3 ml-3 inline-flex items-center gap-2 text-2xl font-medium">
          精選文章
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((page, i) => {
            if (i === 0) return;

            return <BlogRecommend key={page.url} page={page} />;
          })}
        </div>
      </div>
    </div>
  );
}
