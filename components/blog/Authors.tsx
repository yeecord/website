import Link from "next/link";
import Image from "next/image";
import React from "react";
import AuthorsMeta from "../../pages/blog/authors.json";
import { BlogFrontMatter, AuthorData } from "./index";

export function Authors({
    frontMatter,
}: {
    frontMatter: BlogFrontMatter | null;
}) {
    return (
        <div className="h-stack flex-wrap">
            {frontMatter?.authors?.map?.((author) => {
                const data = AuthorsMeta[author as keyof typeof AuthorsMeta] as
                    | AuthorData
                    | undefined;
                const name = data == null ? author : data.name;

                return (
                    <div key={author} className="h-stack gap-2">
                        {data?.image_url != null && (
                            <Image
                                alt="avatar"
                                src={data.image_url}
                                width="50"
                                height="50"
                                className="rounded-full"
                            />
                        )}
                        <div className="flex flex-col">
                            <Link
                                href={data?.url ?? ""}
                                target="_blank"
                                className="heading-md"
                                rel="nofollow noreferrer"
                            >
                                {name}
                            </Link>
                            <p className="text-secondary">{data?.title}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function getAuthor(key: string) {
    const data = AuthorsMeta[key as keyof typeof AuthorsMeta] as
        | AuthorData
        | undefined;

    return data;
}
