import Link from "next/link";
import Image from "next/image";
import React from "react";
import { BlogPage, getTitle } from "@utils/mdx";
import { getTagHref } from "@blog/utils/tags";
import clsx from "clsx";

export function BlogItem({ page }: { page: BlogPage }) {
    const frontMatter = page.frontMatter ?? null;

    const date = frontMatter?.date == null ? null : new Date(frontMatter.date);
    const title = getTitle(page);

    return (
        <div
            key={page.route}
            className={clsx(
                "flex flex-col p-5 gap-3 bg-white transition-colors rounded-lg",
                "shadow-xl shadow-blue-500/10 hover:bg-blue-50 ",
                "dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:shadow-none"
            )}
        >
            <Link
                href={page.route}
                className="relative aspect-video w-full h-auto"
            >
                {frontMatter?.image != null ? (
                    <Image
                        alt="image"
                        src={frontMatter.image}
                        className="rounded-xl object-cover h-full"
                        fill
                        sizes="(max-width: 760px) 90vw, 400px"
                    />
                ) : (
                    <div className="h-full bg-green-400 flex-1 rounded-xl flex flex-col">
                        <Image
                            alt="logo"
                            src="/img/logo-transparent.png"
                            className="w-20 h-20 rounded-full m-auto"
                            width={128}
                            height={128}
                        />
                    </div>
                )}
            </Link>
            <div>
                <div className="flex flex-row gap-3 overflow-hidden">
                    {frontMatter?.tags?.map((tag, i) => (
                        <Link
                            key={i}
                            href={getTagHref(tag)}
                            className="flex-shrink-0"
                        >
                            <p className="text-secondary font-extrabold">
                                #{tag}
                            </p>
                        </Link>
                    ))}
                </div>
                <Link href={page.route} className="text-xl font-extrabold">
                    {title}
                </Link>
            </div>

            <div className="flex flex-row justify-between mt-auto pt-2">
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

export function LargeBlogItem({ page }: { page: BlogPage }) {
    const frontMatter = page.frontMatter ?? null;
    const title = getTitle(page);

    return (
        <div
            key={page.route}
            className={clsx(
                "flex flex-col bg-white rounded-2xl overflow-hidden h-fit",
                "shadow-2xl shadow-blue-700/20",
                "dark:bg-zinc-900 dark:shadow-none"
            )}
        >
            <Link href={page.route} className="relative aspect-video w-full">
                {frontMatter?.image != null ? (
                    <Image
                        alt="image"
                        src={frontMatter.image}
                        className="object-cover h-full"
                        fill
                        priority
                        sizes="80vw"
                    />
                ) : (
                    <div className="h-full bg-green-400 flex-1 flex flex-col">
                        <Image
                            alt="logo"
                            src="/img/logo-transparent.png"
                            className="w-20 h-20 m-auto"
                            width={128}
                            height={128}
                        />
                    </div>
                )}
            </Link>
            <div className="flex flex-col p-5">
                <div className="flex flex-row gap-3 overflow-hidden text-blue-400 font-extrabold">
                    {frontMatter?.tags?.map((tag, i) => (
                        <Link
                            key={i}
                            href={getTagHref(tag)}
                            className="flex-shrink-0"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
                <Link href={page.route} className="text-xl font-extrabold">
                    {title}
                </Link>
            </div>
        </div>
    );
}
