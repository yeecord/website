import React from "react";
import Link from "next/link";
import type { blog } from "@/app/source";
import type { InferPageType } from "fumadocs-core/source";

export function BlogRecommend({ page }: { page: InferPageType<typeof blog> }) {
  return (
    <Link
      href={page.url}
      className="rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <h2 className="mt-2 text-lg font-medium">{page.data.title}</h2>
      <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-muted-foreground">
        {page.data.description}
      </p>
    </Link>
  );
}
