import React from "react";
import { getTitle } from "@utils/mdx";
import clsx from "clsx";
import Link from "next/link";
import { BlogPage } from "@schema/blog";

export function BlogRecommend({ page }: { page: BlogPage }) {
    return (
        <Link
            href={page.route}
            className={clsx(
                "p-3 rounded-xl dark:bg-transparent",
                "hover:bg-blue-50 dark:hover:bg-zinc-800"
            )}
        >
            <div
                className={clsx(
                    "flex flex-wrap font-semibold gap-x-3 gap-y-1 text-sm",
                    "text-blue-600 dark:text-blue-400"
                )}
            >
                {page.frontMatter?.tags?.map((tag) => (
                    <p key={tag} className="flex-shrink-0">
                        #{tag}
                    </p>
                ))}
            </div>
            <h2 className="text-lg">{getTitle(page)}</h2>
        </Link>
    );
}
