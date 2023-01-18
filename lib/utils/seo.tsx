import { ArticleJsonLd } from "next-seo";
import { AuthorData, BlogPageOpts, DocsPageOpts } from "./mdx";

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

    return (
        <ArticleJsonLd
            type="BlogPosting"
            title={page.title}
            isAccessibleForFree
            publisherLogo="/img/logo.png"
            publisherName="YEE式機器龍"
            authorName={authors.map(mapAuthor)}
            url={page.route}
            images={image == null ? [] : [image]}
            datePublished={new Date(date).toJSON()}
            description={description ?? ""}
        />
    );
}
