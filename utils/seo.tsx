import { ArticleJsonLd } from "next-seo";
import { AuthorData, BlogPageOpts, DocsPageOpts, getAuthor } from "./mdx";

export function DocsJsonLd({ page }: { page: DocsPageOpts }) {
    return (
        <ArticleJsonLd
            type="Article"
            title={page.title}
            authorName={[]}
            url={page.route}
            images={[]}
            datePublished={""}
            description={page.frontMatter.description ?? ""}
            isAccessibleForFree
        />
    );
}

export function BlogJsonLd({ page }: { page: BlogPageOpts }) {
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
            title={page.title}
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
