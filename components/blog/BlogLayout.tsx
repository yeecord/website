import Image from "next/image";
import { useRouter } from "next/router";
import { getPagesUnderRoute } from "nextra/context";
import React from "react";
import { ReactNode } from "react";
import { BlogPage } from ".";
import { Authors, getAuthor } from "./Authors";
import styles from "./blog.module.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
    const route = useRouter();
    const page = getPagesUnderRoute("/blog").find((page) => {
        return page.kind === "MdxPage" && page.route === route.route;
    }) as BlogPage | null;

    if (page == null || page.frontMatter?.theme === "raw")
        return <>{children}</>;

    const { frontMatter } = page;
    const title = page.meta?.title || frontMatter?.title || page.name;

    if (frontMatter?.enableLayout === true) {
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
                    {frontMatter?.authors?.map((author) => {
                        const data = getAuthor(author);
                        if (data == null) return <></>;
                        return (
                            <div
                                key={author}
                                className="h-stack font-bold text-lg"
                            >
                                {data.name}
                            </div>
                        );
                    })}
                    <p className="text-secondary">
                        •{" "}
                        {new Date(frontMatter.date).toLocaleDateString(
                            undefined,
                            { dateStyle: "long" }
                        )}
                    </p>
                </div>

                <div className={styles["blog-layout"]}>{children}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-extrabold !text-[2em] mt-2 md:!text-[2.4rem]">
                {title}
            </h1>
            <div className="my-2">
                <Authors frontMatter={frontMatter ?? null} />
            </div>
            <div className={styles["blog-layout-old"]}>{children}</div>
        </div>
    );
}
