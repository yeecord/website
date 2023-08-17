import React from "react";
import clsx from "clsx";
import Link from "next/link";
import type { Blog } from "contentlayer/generated";

export function BlogRecommend({ page }: { page: Blog }) {
  return (
    <Link
      href={"/blog/" + page.slug}
      className="rounded-lg p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <div
        className={clsx(
          "flex flex-wrap gap-x-3 gap-y-1 text-sm text-blue-600",
          "dark:text-blue-400",
        )}
      >
        {page.tags?.map((tag) => (
          <p key={tag} className="flex-shrink-0">
            #{tag}
          </p>
        ))}
      </div>
      <h2 className="mt-2 text-lg font-medium">{page.title}</h2>
    </Link>
  );
}
