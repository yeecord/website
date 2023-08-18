import React from "react";
import Link from "next/link";
import type { Blog } from "contentlayer/generated";

export function BlogRecommend({ page }: { page: Blog }) {
  return (
    <Link
      href={"/blog/" + page.slug}
      className="rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <h2 className="mt-2 text-lg font-medium">{page.title}</h2>
      <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-muted-foreground">
        {page.description}
      </p>
    </Link>
  );
}
