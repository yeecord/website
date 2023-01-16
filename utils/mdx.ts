import { FrontMatter, MdxFile, Page } from "nextra";
import AuthorsMeta from "../pages/blog/authors.json";

export type AuthorData = {
    name: string;
    url?: string;
    title?: string;
    image_url?: string;
};

export type BlogPage = Omit<Page & MdxFile, "frontMatter"> & {
    frontMatter?: BlogFrontMatter;
};

export type BlogFrontMatter = FrontMatter & {
    title: string;
    description?: string;
    date: string;

    image?: string;
    tags?: string[];
    //if theme is raw, we don't inject any components into the page
    theme?: "raw" | "default";
    /* Use the new layout */
    enableLayout?: boolean;
    //The key of blog authors
    authors?: string[];
};

export function getTitle(page: Page & MdxFile) {
    const frontMatter = page.frontMatter;

    return page.meta?.title || frontMatter?.title || page.name;
}

export function getAuthor(key: string) {
    const data = AuthorsMeta[key as keyof typeof AuthorsMeta] as
        | AuthorData
        | undefined;

    return data;
}
