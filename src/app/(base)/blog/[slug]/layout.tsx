import Image from "next/image";
import React from "react";
import { type ReactNode } from "react";
import Link from "next/link";
import { Fragment } from "react";
import { getTagHref } from "@/utils/tags";
import { notFound } from "next/navigation";
import { blogAuthors, type AuthorData } from "@config";
import { blog } from "@/app/source";
import { type InferPageType } from "fumadocs-core/source";

export default function BlogLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return (
    <main
      className="mx-auto w-full max-w-[800px] py-10 sm:py-20"
      itemType="http://schema.org/Article"
      itemScope
    >
      <h1 className="mb-2 text-3xl font-bold leading-normal" itemProp="name">
        {page.data.title}
      </h1>
      <div className="mb-6 mt-3 flex flex-row flex-wrap items-center gap-1">
        <div className="flex flex-row flex-wrap gap-1">
          {page.data.authors.map((author, i) => (
            <Fragment key={i}>
              {i !== 0 && <span className="mx-1">+</span>}
              <SmallAuthor author={blogAuthors[author]} />
            </Fragment>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="mr-1">•</span>
          <span itemProp="datePublished">
            {page.data.date.toLocaleDateString("zh", {
              dateStyle: "long",
            })}
          </span>
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
      className="flex flex-row items-center gap-1.5 text-foreground"
      href={author.url ?? "#"}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp="author"
    >
      {author.image_url != null && (
        <Image
          alt="avatar"
          src={author.image_url}
          width={25}
          height={25}
          className="h-full rounded-full"
        />
      )}
      {author.name}
    </a>
  );
}

function Footer({ page }: { page: InferPageType<typeof blog> }) {
  return (
    <div className="mt-[5rem] flex flex-col gap-6">
      <div className="flex flex-row flex-wrap gap-2 text-base">
        <p>標籤</p>
        {page.data.tags.map((tag) => (
          <Link
            key={tag}
            href={getTagHref(tag)}
            className="rounded-md bg-primary/10 px-1 py-0.5 text-sm text-primary"
            prefetch={false}
          >
            # {tag}
          </Link>
        ))}
      </div>
      {page.data.authors
        .map((author) => blogAuthors[author])
        .map((author, i) => (
          <a
            key={i}
            className="flex flex-row gap-2 rounded-xl bg-card p-4 text-card-foreground"
            href={author.url ?? "#"}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {author.image_url != null && (
              <Image
                itemProp="image"
                alt="avatar"
                src={author.image_url}
                width={40}
                height={40}
                className="h-full rounded-full"
              />
            )}
            <div>
              <p itemProp="name" className="font-medium">
                {author.name}
              </p>
              <p itemProp="jobTitle" className="text-sm text-muted-foreground">
                {author.title}
              </p>
            </div>
          </a>
        ))}
    </div>
  );
}
