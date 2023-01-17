import { FrontMatter, MdxFile, Page, PageOpts } from "nextra";
import { blogAuthors } from "../../config";

export const NEXTRA_INTERNAL = Symbol.for("__nextra_internal__");

export type AuthorData = {
    name: string;
    url?: string;
    title?: string;
    image_url?: string;
};

export type DocsPageOpts = Omit<PageOpts, "frontMatter"> & {
    frontMatter: DocsFrontMatter;
};

export type BlogPageOpts = Omit<PageOpts, "frontMatter"> & {
    frontMatter: BlogFrontMatter;
};

export type BlogPage = Omit<Page & MdxFile, "frontMatter"> & {
    frontMatter?: BlogFrontMatter;
};

export type DocsFrontMatter = FrontMatter & {
    title: string;
    description?: string;
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
    authors: string[] | string;
};

export function getTitle(page: Page & MdxFile) {
    const frontMatter = page.frontMatter;

    return page.meta?.title || frontMatter?.title || page.name;
}

export function getAuthor(key: string) {
    return blogAuthors[key];
}
