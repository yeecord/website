import { FrontMatter, MdxFile, Page, PageMapItem, PageOpts } from "nextra";
import { getPagesUnderRoute } from "nextra/context";
import { useMemo } from "react";
import AuthorsMeta from "../../pages/blog/authors.json";

const NEXTRA_INTERNAL = Symbol.for("__nextra_internal__");

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
    const data = AuthorsMeta[key as keyof typeof AuthorsMeta] as
        | AuthorData
        | undefined;

    return data;
}

export function usePage<T extends Page>(
    route: string,
    /**
     * Return null if not enabled
     */
    enabled: boolean = true
): T | null {
    return useMemo(() => {
        if (!enabled) return null;

        const last = route.lastIndexOf("/");
        if (last === -1) return null;

        //search in parent folder if it's a .mdx file
        const search = last === 0 ? route : route.slice(0, last);

        return getPagesUnderRoute(search).find(
            (page) => page.kind === "MdxPage" && page.route === route
        ) as T | null;
    }, [route, enabled]);
}

export function getPageMap(): PageMapItem[] {
    return (globalThis as any)[NEXTRA_INTERNAL].pageMap;
}
