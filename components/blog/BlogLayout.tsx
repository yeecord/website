import { BlogPage, getAuthor, getTitle } from "@utils/mdx";
import Image from "next/image";
import React from "react";
import { ReactNode } from "react";
import { Authors } from "./Authors";
import styles from "./blog.module.css";

export default function BlogLayout({
    page,
    children,
}: {
    page: BlogPage;
    children: ReactNode;
}) {
    if (page.frontMatter?.theme === "raw") return <>{children}</>;

    if (page.frontMatter?.enableLayout === true) {
        return <NewBlogLayout page={page}>{children}</NewBlogLayout>;
    }

    const title = getTitle(page);

    return (
        <div>
            <h1 className="font-extrabold !text-[2em] mt-2 md:!text-[2.4rem] tracking-tighter">
                {title}
            </h1>
            <div className="my-2">
                {page.frontMatter != null && (
                    <Authors frontMatter={page.frontMatter} />
                )}
            </div>
            <div className={styles["blog-layout-old"]}>{children}</div>
        </div>
    );
}

function NewBlogLayout({
    page,
    children,
}: {
    page: BlogPage;
    children: ReactNode;
}) {
    const { frontMatter } = page;
    const title = getTitle(page);
    if (frontMatter == null) return <>{children}</>;

    const authors: string[] = Array.isArray(frontMatter.authors)
        ? frontMatter.authors
        : [frontMatter.authors];

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
                {authors.map((author) => {
                    const data = getAuthor(author);
                    if (data == null) return <></>;
                    return (
                        <div key={author} className="h-stack font-bold text-lg">
                            {data.name}
                        </div>
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
        </div>
    );
}
