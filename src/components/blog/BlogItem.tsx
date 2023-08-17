import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getTagHref } from "@utils/tags";
import clsx from "clsx";
import type { Blog } from "@/.contentlayer/generated";

export function BlogItem({ page }: { page: Blog }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-lg bg-white p-5 transition-colors",
        "shadow-xl shadow-blue-500/10 hover:bg-blue-50 ",
        "dark:bg-zinc-900 dark:shadow-none dark:hover:bg-zinc-800",
      )}
    >
      <Link
        href={"/blog/" + page.slug}
        className="relative aspect-video h-auto w-full"
      >
        {page.image != null ? (
          <Image
            alt="image"
            src={page.image}
            className="h-full rounded-xl object-cover"
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
      <div>
        <div className="flex flex-row gap-3 overflow-hidden">
          {page.tags?.map((tag, i) => (
            <Link
              key={i}
              href={getTagHref(tag)}
              className="flex-shrink-0 font-extrabold text-muted-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <Link href={"/blog/" + page.slug} className="text-xl font-extrabold">
          {page.title}
        </Link>
      </div>

      <div className="mt-auto flex flex-row justify-between pt-2">
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
    <div
      className={clsx(
        "flex h-fit flex-col overflow-hidden rounded-2xl bg-white",
        "shadow-2xl shadow-blue-700/20",
        "dark:bg-zinc-900 dark:shadow-none",
      )}
    >
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
        <div className="flex flex-row gap-3 overflow-hidden font-extrabold text-blue-600 dark:text-blue-400">
          {page.tags?.map((tag, i) => (
            <Link key={i} href={getTagHref(tag)} className="flex-shrink-0">
              #{tag}
            </Link>
          ))}
        </div>
        <Link href={"/blog/" + page.slug} className="text-xl font-extrabold">
          {page.title}
        </Link>
      </div>
    </div>
  );
}
