import { ArticleJsonLd } from "next-seo";
import { AuthorData, BlogPage, DocsPage, getAuthor, getTitle } from "./mdx";

export function DocsJsonLd({ page }: { page: DocsPage }) {
    if (page.frontMatter == null) return <></>;
    const title = getTitle(page);

    return (
        <ArticleJsonLd
            type="Article"
            title={title}
            authorName={[]}
            url={page.route}
            images={[]}
            datePublished={""}
            description={page.frontMatter.description ?? ""}
        />
    );
}

export function BlogJsonLd({ page }: { page: BlogPage }) {
    if (page.frontMatter == null) return <></>;

    const { image, authors, date, description } = page.frontMatter;

    const mapAuthor = (author: AuthorData) => {
        return {
            name: author.name,
            url: author.url,
        };
    };

    const getAuthors = () => {
        const list = Array.isArray(authors) ? authors : [authors];

        return list.flatMap((author) => {
            const data = getAuthor(author);
            if (data == null) return [];

            return [mapAuthor(data)];
        });
    };

    return (
        <ArticleJsonLd
            type="BlogPosting"
            title={getTitle(page)}
            isAccessibleForFree
            publisherLogo="/img/logo.png"
            publisherName="YEE式機器龍"
            authorName={getAuthors()}
            url={page.route}
            images={image == null ? [] : [image]}
            datePublished={new Date(date).toJSON()}
            description={description ?? ""}
        />
    );
}
