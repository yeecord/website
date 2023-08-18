import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getTagHref } from "@/utils/tags";
import type { Blog } from "contentlayer/generated";

export function BlogItem({ page }: { page: Blog }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      <Link
        href={"/blog/" + page.slug}
        className="relative aspect-video h-auto w-full"
      >
        {page.image != null ? (
          <Image
            alt="image"
            src={page.image}
            className="h-full rounded-md object-cover"
            fill
            sizes="(max-width: 760px) 90vw, 400px"
          />
        ) : (
          <div className="flex h-full flex-1 flex-col rounded-xl bg-green-400">
            <Image
              alt="logo"
              src="/img/logo-transparent.png"
              className="m-auto h-20 w-20 rounded-full"
              width={128}
              height={128}
            />
          </div>
        )}
      </Link>
      <div className="flex flex-row gap-3 overflow-hidden">
        {page.tags?.map((tag, i) => (
          <Link
            key={i}
            href={getTagHref(tag)}
            className="flex-shrink-0 text-sm font-medium text-muted-foreground"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <Link href={"/blog/" + page.slug} className="text-lg font-semibold">
        {page.title}
      </Link>

      <div className="mt-auto flex flex-row justify-between pt-2 text-sm">
        <Link href={"/blog/" + page.slug} className="font-bold text-blue-500">
          閱讀更多 →
        </Link>
        <p className="text-md font-bold opacity-80">
          {new Date(page.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function LargeBlogItem({ page }: { page: Blog }) {
  return (
    <div className="flex h-fit flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      <Link
        href={"/blog/" + page.slug}
        className="relative aspect-video w-full"
      >
        {page.image != null ? (
          <Image
            alt="image"
            src={page.image}
            className="h-full object-cover"
            fill
            priority
            sizes="80vw"
          />
        ) : (
          <div className="flex h-full flex-1 flex-col bg-green-400">
            <Image
              alt="logo"
              src="/img/logo-transparent.png"
              className="m-auto h-20 w-20"
              width={128}
              height={128}
            />
          </div>
        )}
      </Link>
      <div className="flex flex-col p-5">
        <div className="flex flex-row gap-3 overflow-hidden text-sm font-medium text-blue-600 dark:text-blue-400">
          {page.tags?.map((tag, i) => (
            <Link key={i} href={getTagHref(tag)} className="flex-shrink-0">
              #{tag}
            </Link>
          ))}
        </div>
        <Link href={"/blog/" + page.slug} className="text-lg font-semibold">
          {page.title}
        </Link>
      </div>
    </div>
  );
}
