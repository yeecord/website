import Link from "next/link";
import Image from "next/image";
import React from "react";
import Authors from "./Authors";
import { BlogPage, getTitle } from "../../utils/mdx";

export function BlogItem({ page }: { page: BlogPage }) {
    const frontMatter = page.frontMatter ?? null;

    const date = frontMatter?.date == null ? null : new Date(frontMatter.date);
    const title = getTitle(page);

    return (
        <div
            key={page.route}
            className="flex flex-col p-5 gap-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg"
        >
            {frontMatter != null && <Authors frontMatter={frontMatter} />}
            {frontMatter?.image != null && (
                <Link
                    href={page.route}
                    className="relative aspect-video w-full h-auto"
                >
                    <Image
                        alt="image"
                        src={frontMatter.image}
                        className="rounded-lg object-cover"
                        fill
                        sizes="(max-width: 900px) 90vw, 800px"
                        priority
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
