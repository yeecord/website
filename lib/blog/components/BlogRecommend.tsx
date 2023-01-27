import React from "react";
import { getTitle } from "@utils/mdx";
import clsx from "clsx";
import Link from "next/link";
import { BlogPage } from "@schema/blog";

export function BlogRecommend({ page }: { page: BlogPage }) {
  return (
    <Link
      href={page.route}
      className={clsx(
        "rounded-xl p-3 dark:bg-transparent",
        "hover:bg-blue-50 dark:hover:bg-zinc-800"
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold",
          "text-link"
        )}
      >
        {page.frontMatter.tags.map((tag) => (
          <p key={tag} className="flex-shrink-0">
            #{tag}
          </p>
        ))}
      </div>
      <h2 className="text-lg font-bold">{getTitle(page)}</h2>
    </Link>
  );
}
