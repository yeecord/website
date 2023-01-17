import { getPagesUnderRoute } from "nextra/context";
import React from "react";
import { BlogPage, getTitle } from "@utils/mdx";
import { BlogItem, LargeBlogItem } from "./components/BlogItem";
import clsx from "clsx";
import { LinkButton } from "@components/mdx";
import { BsCheckCircleFill, BsEyeFill } from "react-icons/bs";
import { blogRecommendations } from "../../config";
import { RiGithubFill } from "react-icons/ri";
import { BlogRecommend } from "./BlogRecommend";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { GetStaticProps } from "next";

type Props = {
    pages: BlogPage[];
    recommendations: BlogPage[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const pages = getPagesUnderRoute("/blog").filter(
        (page) => page.kind === "MdxPage"
    ) as BlogPage[];

    const recommendations = blogRecommendations.flatMap((name) => {
        return pages.find((page) => page.name === name) ?? [];
    });

    return {
        props: { recommendations, pages },
    };
};
//
export default function BlogIndex(props: Props) {
    const { pages, recommendations } = props;
    const [search, setSearch] = useState("");

    return (
        <div
            className={clsx(
                "flex flex-col gap-5 max-w-[1300px] p-5 text-slate-700 dark:text-gray-200",
                "mx-auto mb-[5rem]"
            )}
        >
            <div className="mt-16 mb-5">
                <h1 className="font-bold text-center text-4xl md:text-5xl mb-8">
                    我們的部落格
                </h1>
                <div className="h-stack justify-center max-sm:items-stretch max-sm:flex-col">
                    <LinkButton
                        href="/blog/tags"
                        icon={<BsEyeFill className="text-xl" />}
                        variant="primary"
                    >
                        查看所有標籤
                    </LinkButton>
                    <LinkButton
                        href="https://github.com/yeecord/docs"
                        icon={<RiGithubFill className="text-xl" />}
                        target="_blank"
                    >
                        加入我們
                    </LinkButton>
                </div>
            </div>

            <div
                className={clsx(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.8fr]",
                    "mb-16 gap-5 lg:gap-10"
                )}
            >
                <LargeBlogItem page={recommendations[0]} />
                <div className="max-md:-ml-3">
                    <h2 className="font-bold text-3xl ml-3 mb-3 inline-flex gap-2">
                        精選文章{" "}
                        <BsCheckCircleFill className="text-green-400" />
                    </h2>
                    <div className="flex flex-col gap-3">
                        {recommendations.map((page, i) => {
                            if (i === 0) return;

                            return (
                                <BlogRecommend key={page.route} page={page} />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3">
                <h2 className="font-bold text-4xl max-sm:text-center sm:ml-5">
                    新文章
                </h2>
                <div className="h-stack">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg bg-slate-100 dark:bg-zinc-800 px-4 py-2"
                        placeholder="搜索文章"
                    />
                    <FiFilter className="text-xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pages.map((page) => {
                    if (
                        page.kind !== "MdxPage" ||
                        !getTitle(page)
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    ) {
                        return <React.Fragment key={page.route} />;
                    }

                    return <BlogItem key={page.route} page={page} />;
                })}
            </div>
        </div>
    );
}