import { BlogPageOpts } from "@schema/blog";
import Image from "next/image";
import React from "react";
import { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Fragment } from "react";
import { getTagHref } from "@blog/utils/tags";
import { PageOpts } from "nextra";
import { AuthorData, BlogFrontMatterSchema } from "@schema/blog";
import { BlogJsonLd } from "./blog-json-ld";

export default function BlogLayout({
  page,
  children,
}: {
  page: PageOpts;
  children: ReactNode;
}) {
  const blog: BlogPageOpts = {
    ...page,
    frontMatter: BlogFrontMatterSchema.parse(page.frontMatter),
  };

  return (
    <>
      <BlogJsonLd page={blog} />
      <PageContainer page={blog}>{children}</PageContainer>
    </>
  );
}

function PageContainer({
  page,
  children,
}: {
  page: BlogPageOpts;
  children: ReactNode;
}) {
  const frontMatter = page.frontMatter;
  if (frontMatter.theme === "raw") return <>{children}</>;

  return (
    <div className="mt-10">
      <p className="text-link text-base font-semibold lg:text-lg">
        {page.readingTime != null &&
          `閱讀時間約 ${Math.round(page.readingTime.minutes)} 分鐘`}
      </p>
      <h1 className="mb-2 text-3xl font-extrabold leading-normal md:!text-[2.4rem]">
        {page.title}
      </h1>
      <div className="text-secondary mb-6 mt-3 flex flex-row flex-wrap gap-1 text-lg font-bold">
        <div className="h-stack flex-wrap gap-1">
          {frontMatter.authors.map((author, i) => (
            <Fragment key={i}>
              {i !== 0 && <span className="mx-1">+</span>}
              <SmallAuthor author={author} />
            </Fragment>
          ))}
        </div>

        <p>
          <span className="mr-1">•</span>
          {new Date(frontMatter.date).toLocaleDateString("zh", {
            dateStyle: "long",
          })}
        </p>
      </div>
      {children}
      <Footer page={page} />
    </div>
  );
}

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <a
      className="h-stack gap-1 font-bold text-black dark:text-white"
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

function Footer({ page }: { page: BlogPageOpts }) {
  const { authors, tags } = page.frontMatter;

  return (
    <div className="mt-[5rem] flex flex-col gap-6">
      <div className="h-stack flex-wrap gap-2 text-base">
        <p className="text-lg text-black dark:text-white">標籤</p>
        {tags.map((tag) => (
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
      {authors.map((author, i) => (
        <a
          key={i}
          className="h-stack rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800"
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
            <p className="text-secondary text-lg">{author.title}</p>
          </div>
        </a>
      ))}
      <div
        className={clsx(
          "flex flex-col gap-3 rounded-xl p-4",
          "bg-gradient-to-br from-pink-50/50 via-pink-100 to-cyan-200/50",
          "dark:from-cyan-800/20 dark:to-purple-400/50"
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
