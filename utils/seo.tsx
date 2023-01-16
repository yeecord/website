import { Page } from "nextra";
import { ArticleJsonLd } from "next-seo";
import { AuthorData, BlogPage, getAuthor, getTitle } from "./mdx";

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
            authorName={getAuthors()}
            url={page.route}
            images={image == null ? [] : [image]}
            datePublished={new Date(date).toJSON()}
            description={description ?? ""}
        />
    );
}
