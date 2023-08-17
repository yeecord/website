import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Blog } from "@/.contentlayer/generated";

export function BlogRecommend({ page }: { page: Blog }) {
  return (
    <Link
      href={"/blog/" + page.slug}
      className={clsx(
        "rounded-xl p-3 dark:bg-transparent",
        "hover:bg-blue-50 dark:hover:bg-zinc-800",
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-blue-600",
          "dark:text-blue-400",
        )}
      >
        {page.tags?.map((tag) => (
          <p key={tag} className="flex-shrink-0">
            #{tag}
          </p>
        ))}
      </div>
      <h2 className="text-lg font-bold">{page.title}</h2>
    </Link>
  );
}
