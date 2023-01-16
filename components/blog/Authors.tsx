import Link from "next/link";
import Image from "next/image";
import React from "react";
import { BlogFrontMatter, getAuthor } from "@utils/mdx";

export function Authors({
    frontMatter,
}: {
    frontMatter: BlogFrontMatter | null;
}) {
    return (
        <div className="flex flex-row justify-between flex-wrap gap-4">
            {frontMatter?.authors?.map?.((key) => {
                const author = getAuthor(key);
                const name = author == null ? key : author.name;

                return (
                    <div key={key} className="h-stack gap-2">
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
                                className="heading-md"
                                rel="nofollow noreferrer"
                            >
                                {name}
                            </Link>
                            <p className="text-secondary">{author?.title}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
