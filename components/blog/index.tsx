import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import { FrontMatter, MdxFile, Page } from "nextra";
import Image from "next/image";
import React from "react";
import AuthorsMeta from "../../pages/blog/authors.json";

type AuthorData = {
  name: string;
  url?: string;
  title?: string;
  image_url?: string;
};

type BlogFrontMatter = FrontMatter & {
  date: string;
  image?: string;
  tags?: string[];
  //The key of blog authors
  authors?: string[];
};

export default function BlogIndex() {
  return (
    <div className="flex flex-col gap-3 mt-5">
      {getPagesUnderRoute("/blog").map((page) => {
        if (page.kind !== "MdxPage") {
          return <React.Fragment key={page.route} />;
        }

        return <BlogItem key={page.route} page={page} />;
      })}
    </div>
  );
}

function BlogItem({ page }: { page: Page & MdxFile }) {
  const frontMatter = page.frontMatter as BlogFrontMatter | null;

  const date = frontMatter?.date == null ? null : new Date(frontMatter.date);
  const title = page.meta?.title || frontMatter?.title || page.name;

  return (
    <div
      key={page.route}
      className="flex flex-col p-5 gap-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg"
    >
      <Authors frontMatter={frontMatter} />
      {frontMatter?.image != null && (
        <Link href={page.route} className="relative aspect-video w-full h-auto">
          <Image
            alt="image"
            src={frontMatter.image}
            className="rounded-lg object-cover"
            fill
          />
        </Link>
      )}

      <Link href={page.route} className="text-2xl font-extrabold">
        {title}
      </Link>
      <p className="opacity-80">{frontMatter?.description}</p>
      <div className="flex flex-row gap-3 items-end flex-wrap">
        {frontMatter?.tags?.map((tag, i) => (
          <p
            key={i}
            className="p-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-700/50 dark:text-white font-extrabold rounded-md"
          >
            {tag}
          </p>
        ))}
      </div>

      <div className="flex flex-row justify-between mt-2">
        <Link href={page.route} className="text-blue-500 font-bold">
          閱讀更多 →
        </Link>
        {frontMatter?.date ? (
          <p className="opacity-80 text-md font-bold">
            {date?.toLocaleDateString()}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Authors({ frontMatter }: { frontMatter: BlogFrontMatter | null }) {
  return (
    <div className="h-stack flex-wrap">
      {frontMatter?.authors?.map?.((author) => {
        const data = AuthorsMeta[author as keyof typeof AuthorsMeta] as
          | AuthorData
          | undefined;
        const name = data == null ? author : data.name;

        return (
          <div key={author} className="h-stack gap-2">
            {data?.image_url != null && (
              <Image
                alt="avatar"
                src={data.image_url}
                width="50"
                height="50"
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <Link
                href={data?.url ?? ""}
                target="_blank"
                className="heading-md"
              >
                {name}
              </Link>
              <p className="text-secondary">{data?.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
