import Link from "next/link";
import Image from "next/image";
import React from "react";
import { AuthorData } from "@utils/mdx";
import { BlogFrontMatter } from "@schema/blog";

export default function Authors({
    frontMatter,
}: {
    frontMatter: BlogFrontMatter;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frontMatter.authors.map((author, i) => (
                <Author key={i} author={author} />
            ))}
        </div>
    );
}

function Author({ author }: { author: AuthorData }) {
    return (
        <div className="h-stack gap-3">
            {author?.image_url != null && (
                <Image
                    alt="avatar"
                    src={author.image_url}
                    width="50"
                    height="50"
                    className="rounded-full"
                />
            )}
            <div className="flex flex-col">
                <Link
                    href={author?.url ?? ""}
                    target="_blank"
                    className="heading-md text-black dark:text-white"
                    rel="nofollow noreferrer"
                >
                    {author.name}
                </Link>
                <p className="text-secondary">{author?.title}</p>
            </div>
        </div>
    );
}
