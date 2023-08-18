import React from "react";
import { BlogItem, LargeBlogItem } from "@/components/blog/BlogItem";
import clsx from "clsx";
import { LinkButton } from "@/components/LinkButton";
import { BsEyeFill } from "react-icons/bs";
import { blogRecommendations } from "@config";
import { RiGithubFill } from "react-icons/ri";
import { BlogRecommend } from "@/components/blog/BlogRecommend";
import { type Blog, allBlogs } from "contentlayer/generated";

export default function BlogIndex() {
  const pages = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const recommendations = blogRecommendations.flatMap((name) => {
    return pages.find((page) => page.slug === name) ?? [];
  });

  return (
    <div
      className={clsx(
        "flex max-w-[1300px] flex-col gap-5 p-5 text-slate-700 dark:text-gray-200",
        "mx-auto mb-[5rem]",
      )}
    >
      <div className="mb-5 mt-16">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
          我們的部落格
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <LinkButton
            href="/blog/tags"
            icon={<BsEyeFill className="text-xl" />}
            variant="primary"
          >
            查看所有標籤
          </LinkButton>
          <LinkButton
            href="https://github.com/yeecord/website"
            icon={<RiGithubFill className="text-xl" />}
            target="_blank"
          >
            加入我們
          </LinkButton>
        </div>
      </div>

      <Recommendations items={recommendations} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <h2 className="text-4xl font-bold max-sm:text-center sm:ml-5">
          新文章
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          return <BlogItem key={page._id} page={page} />;
        })}
      </div>
    </div>
  );
}

function Recommendations({ items }: { items: Blog[] }) {
  return (
    <div className="mb-16 grid grid-cols-1 gap-8 min-[816px]:grid-cols-2">
      {items[0] != null && <LargeBlogItem page={items[0]} />}
      <div className="max-md:-ml-3">
        <h2 className="mb-3 ml-3 inline-flex items-center gap-2 text-2xl font-medium">
          精選文章
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((page, i) => {
            if (i === 0) return;

            return <BlogRecommend key={page._id} page={page} />;
          })}
        </div>
      </div>
    </div>
  );
}
