import {
    AuthorData,
    BlogFrontMatter,
    BlogPageOpts,
    getAuthor,
} from "@utils/mdx";
import Image from "next/image";
import React from "react";
import { ReactNode } from "react";
import styles from "./blog.module.css";
import Authors from "@blog/components/Authors";
import Link from "next/link";
import clsx from "clsx";

export default function BlogLayout({
    page,
    children,
}: {
    page: BlogPageOpts;
    children: ReactNode;
}) {
    if (page.frontMatter.theme === "raw") return <>{children}</>;

    if (page.frontMatter.enableLayout === true) {
        return <NewBlogLayout page={page}>{children}</NewBlogLayout>;
    }

    return (
        <div>
            <h1 className="font-extrabold !text-[2em] mt-2 md:!text-[2.4rem] tracking-tighter">
                {page.title}
            </h1>
            <div className="my-2">
                <p className="text-secondary my-2">
                    {page.readingTime != null &&
                        `閱讀時間約 ${Math.round(
                            page.readingTime.minutes
                        )} 分鐘`}
                    {" • "}
                    {new Date(page.frontMatter.date).toLocaleDateString(
                        undefined,
                        {
                            dateStyle: "long",
                        }
                    )}
                </p>
                {page.frontMatter != null && (
                    <Authors
                        frontMatter={page.frontMatter as BlogFrontMatter}
                    />
                )}
            </div>
            <div className={styles["blog-layout-old"]}>{children}</div>
            <Footer />
        </div>
    );
}

function NewBlogLayout({
    page,
    children,
}: {
    page: BlogPageOpts;
    children: ReactNode;
}) {
    const { frontMatter } = page;
    const title = page.title;

    const authors: AuthorData[] = (
        Array.isArray(frontMatter.authors)
            ? frontMatter.authors
            : [frontMatter.authors]
    ).flatMap((author) => getAuthor(author) ?? []);

    return (
        <div>
            {frontMatter?.image != null && (
                <div className="relative aspect-video w-full h-auto">
                    <Image
                        alt="banner"
                        src={frontMatter.image}
                        className="rounded-lg object-cover"
                        fill
                    />
                </div>
            )}
            <h1 className="font-extrabold !text-[2.4rem] mt-10 mb-2">
                {title}
            </h1>
            <div className="h-stack mb-6">
                {authors.map((author, i) => {
                    return (
                        <Link
                            key={i}
                            className="h-stack gap-1 font-bold text-lg"
                            href={author.url ?? ""}
                            rel="nofollow noreferrer"
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
                        </Link>
                    );
                })}
                <p className="text-secondary">
                    •{" "}
                    {new Date(frontMatter.date).toLocaleDateString(undefined, {
                        dateStyle: "long",
                    })}
                </p>
            </div>
            <div className={styles["blog-layout"]}>{children}</div>
            <Footer authors={authors} />
        </div>
    );
}

function Footer({ authors }: { authors?: AuthorData[] }) {
    return (
        <div className="flex flex-col gap-6 mt-[5rem]">
            {authors?.map((author, i) => (
                <Link
                    key={i}
                    className="h-stack p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                    href={author.url ?? ""}
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
                        <h2 className="font-bold text-2xl">{author.name}</h2>
                        <p className="text-secondary text-lg">{author.title}</p>
                    </div>
                </Link>
            ))}
            <div
                className={clsx(
                    "flex flex-col gap-3 rounded-xl p-4",
                    "bg-gradient-to-br from-pink-50/50 via-pink-100 to-cyan-200/50",
                    "dark:from-cyan-800/20 dark:to-purple-400/50"
                )}
            >
                <h2 className="font-extrabold text-3xl">
                    也想成為
                    <br className="min-[400px]:hidden" />
                    內容創作者?
                </h2>
                <p className="font-semibold sm:text-lg">
                    通過 github 為我們貢獻!
                </p>
                <Link
                    href="https://github.com/yeecord/docs"
                    target="_blank"
                    className="w-fit"
                >
                    <button className="px-4 py-2 bg-blue-400 font-bold rounded-lg text-white">
                        加入我們
                    </button>
                </Link>
            </div>
        </div>
    );
}
