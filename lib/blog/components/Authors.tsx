import Link from "next/link";
import Image from "next/image";
import React from "react";
import { BlogFrontMatter, getAuthor } from "../../utils/mdx";

export default function Authors({
    frontMatter,
}: {
    frontMatter: BlogFrontMatter;
}) {
    if (Array.isArray(frontMatter.authors)) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {frontMatter?.authors?.map?.((key) => (
                    <Author key={key} authorId={key} />
                ))}
            </div>
        );
    }

    return (
        <div>
            <Author authorId={frontMatter?.authors} />
        </div>
    );
}

function Author({ authorId }: { authorId: string }) {
    const author = getAuthor(authorId);
    const name = author == null ? authorId : author.name;

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
                    className="heading-md"
                    rel="nofollow noreferrer"
                >
                    {name}
                </Link>
                <p className="text-secondary">{author?.title}</p>
            </div>
        </div>
    );
}
