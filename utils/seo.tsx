import { Page } from "nextra";
import { ArticleJsonLd } from "next-seo";
import { BlogPage, getAuthor, getTitle } from "./mdx";

export function JsonLd({ page }: { page: Page }) {
    return (
        <ArticleJsonLd
            title=""
            authorName=""
            url={""}
            images={[]}
            datePublished={""}
            description={""}
        />
    );
}

export function BlogJsonLd({ page }: { page: BlogPage }) {
    const image = page.frontMatter?.image;

    return (
        <ArticleJsonLd
            title={getTitle(page)}
            authorName={page.frontMatter?.authors
                ?.flatMap((author) => getAuthor(author)?.name ?? "")
                .join(", ")}
            url={page.route}
            images={image == null ? [] : [image]}
            datePublished={
                page.frontMatter?.date ?? new Date(Date.now()).toDateString()
            }
            description={page.frontMatter?.description ?? ""}
        />
    );
}
