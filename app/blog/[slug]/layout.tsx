import Image from "next/image";
import React from "react";
import { type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Fragment } from "react";
import { getTagHref } from "@utils/tags";
import { Blog, allBlogs } from "@/.contentlayer/generated";
import { notFound } from "next/navigation";
import { AuthorData } from "@schema/blog";
import { blogAuthors } from "@/config";

export default function BlogLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const page = allBlogs.find((blog) => blog.slug === params.slug);

  if (!page) notFound();

  return (
    <main className="mx-auto w-full max-w-[800px] py-10 sm:py-20">
      <h1 className="mb-2 text-3xl font-bold leading-normal md:!text-[2.4rem]">
        {page.title}
      </h1>
      <div className="mb-6 mt-3 flex flex-row flex-wrap items-center gap-1">
        <div className="flex flex-row flex-wrap gap-1">
          {page.authors?.map((author, i) => (
            <Fragment key={i}>
              {i !== 0 && <span className="mx-1">+</span>}
              <SmallAuthor author={blogAuthors[author]} />
            </Fragment>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="mr-1">•</span>
          {new Date(page.date).toLocaleDateString("zh", {
            dateStyle: "long",
          })}
        </p>
      </div>
      {children}
      <Footer page={page} />
    </main>
  );
}

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <a
      className="flex flex-row items-center gap-1 text-foreground"
      href={author.url ?? "#"}
      rel="nofollow noreferrer"
      target="_blank"
    >
      {author.image_url != null && (
        <Image
          alt="avatar"
          src={author.image_url}
          width={25}
          height={25}
          className="rounded-full"
        />
      )}
      {author.name}
    </a>
  );
}

function Footer({ page }: { page: Blog }) {
  return (
    <div className="mt-[5rem] flex flex-col gap-6">
      <div className="h-stack flex-wrap gap-2 text-base">
        <p className="text-lg text-black dark:text-white">標籤</p>
        {page.tags?.map((tag) => (
          <Link
            key={tag}
            href={getTagHref(tag)}
            className="bg-blue-100 px-2 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            prefetch={false}
          >
            # {tag}
          </Link>
        ))}
      </div>
      {page.authors
        ?.map((author) => blogAuthors[author])
        .map((author, i) => (
          <a
            key={i}
            className="h-stack rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900"
            href={author.url ?? "#"}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {author.image_url != null && (
              <Image
                alt="avatar"
                src={author.image_url}
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{author.name}</h2>
              <p className="text-lg text-muted-foreground">{author.title}</p>
            </div>
          </a>
        ))}
      <div
        className={clsx(
          "flex flex-col gap-3 rounded-xl p-4",
          "bg-gradient-to-br from-pink-50/50 via-pink-100 to-cyan-200/50",
          "dark:from-cyan-800/20 dark:to-purple-400/50",
        )}
      >
        <h2 className="font-extrabold">
          <span className="text-2xl max-sm:text-blue-400 sm:text-3xl">
            也想成為
          </span>
          <br className="sm:hidden" />
          <span className="text-3xl">內容創作者?</span>
        </h2>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          通過 Github 為我們貢獻
        </p>
        <a
          href="https://github.com/yeecord/website"
          target="_blank"
          className="w-fit"
          rel="noreferrer"
        >
          <button className="rounded-lg bg-blue-400 px-4 py-2 font-bold text-white">
            加入我們
          </button>
        </a>
      </div>
    </div>
  );
}
