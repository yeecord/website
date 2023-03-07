import React from "react";
import { getTitle } from "@utils/mdx";
import { BlogItem, LargeBlogItem } from "./components/BlogItem";
import clsx from "clsx";
import { LinkButton } from "@components/mdx";
import { BsCheckCircleFill, BsEyeFill } from "react-icons/bs";
import { blogRecommendations } from "../../config";
import { RiGithubFill } from "react-icons/ri";
import { BlogRecommend } from "./components/BlogRecommend";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { GetStaticProps } from "next";
import { BlogPage, BlogPageSchema } from "@schema/blog";
import { getBlogPageMap } from "./utils/get-page-map";

type Props = {
  pages: BlogPage[];
  recommendations: BlogPage[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = getBlogPageMap().flatMap((page) => {
    const result = BlogPageSchema.safeParse(page);
    if (!result.success) {
      console.error(page.route, result.error.issues);
      return [];
    }

    return [result.data];
  });

  const recommendations = blogRecommendations.flatMap((name) => {
    return pages.find((page) => page.name === name) ?? [];
  });

  return {
    props: { recommendations, pages },
  };
};
//
export default function BlogIndex({ pages, recommendations }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div
      className={clsx(
        "flex max-w-[1300px] flex-col gap-5 p-5 text-slate-700 dark:text-gray-200",
        "mx-auto mb-[5rem]"
      )}
    >
      <div className="mt-16 mb-5">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
          我們的部落格
        </h1>
        <div className="h-stack justify-center max-sm:flex-col max-sm:items-stretch">
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
        <div className="h-stack">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg bg-slate-100 px-4 py-2 dark:bg-zinc-800"
            placeholder="搜索文章"
          />
          <FiFilter className="text-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          if (!getTitle(page).toLowerCase().includes(search.toLowerCase())) {
            return <React.Fragment key={page.route} />;
          }

          return <BlogItem key={page.route} page={page} />;
        })}
      </div>
    </div>
  );
}

function Recommendations({ items }: { items: BlogPage[] }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.8fr]",
        "mb-16 gap-5 lg:gap-10"
      )}
    >
      {items[0] != null && <LargeBlogItem page={items[0]} />}
      <div className="max-md:-ml-3">
        <h2 className="ml-3 mb-3 inline-flex gap-2 text-3xl font-bold">
          精選文章 <BsCheckCircleFill className="text-green-400" />
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((page, i) => {
            if (i === 0) return;

            return <BlogRecommend key={page.route} page={page} />;
          })}
        </div>
      </div>
    </div>
  );
}
