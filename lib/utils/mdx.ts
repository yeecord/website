import { BlogFrontMatter } from "@schema/blog";
import { FrontMatter, MdxFile, Page, PageOpts } from "nextra";

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

export type RawBlogPage = Page & MdxFile;

export type DocsFrontMatter = FrontMatter & {
    title: string;
    description?: string;
};

export function getTitle(page: Page & MdxFile): string {
    const frontMatter = page.frontMatter;

    return page.meta?.title || frontMatter?.title || page.name;
}
