import { BlogPage, NEXTRA_INTERNAL } from "@utils/mdx";
import { Folder, MdxFile, PageMapItem, PageOpts } from "nextra";

interface Page extends BlogPage {
    children?: Page[];
}

const flattenPageMap = (page: Page, result: PageMapItem[] = []) => {
    if (Array.isArray(page.children!)) {
        page.children.forEach((p) => flattenPageMap(p, result));
    }
    result.push(page);
};

const flattenPageMaps = (pages: Page[], result: PageMapItem[] = []) => {
    pages.forEach((v) => flattenPageMap(v, result));
};

export const getStaticTags = (pageMap: PageMapItem[]) => {
    const result: Page[] = [];
    flattenPageMaps(pageMap as Page[], result);
    return Array.from(new Set(result.map(getTags).flat(1).filter(Boolean)));
};

export type TagInfo = {
    count: number;
};
export const getStaticTagsMap = (pageMap: PageMapItem[]) => {
    const result: Page[] = [];
    flattenPageMaps(pageMap as Page[], result);
    const map = new Map<string, TagInfo>();

    for (const page of result) {
        for (const tag of getTags(page)) {
            const info = map.get(tag);

            if (info != null) {
                info.count++;
            } else {
                map.set(tag, {
                    count: 1,
                });
            }
        }
    }

    return map;
};

export default function getTags(page: MdxFile) {
    if (!page.frontMatter) {
        return [];
    }

    return page.frontMatter.tags?.map((tag: string) => tag.toLowerCase()) || [];
}

export function getTagHref(tag: string) {
    return `/blog/tags/${tag.toLowerCase()}`;
}
// copied from NextraInternalGlobal
type NextraInternal = {
    pageMap: PageMapItem[];
    route: string;
    context: Record<
        string,
        {
            Content: React.FC;
            pageOpts: PageOpts;
            themeConfig: any | null;
        }
    >;
    refreshListeners: Record<string, (() => void)[]>;
    Layout: React.FC<any>;
};

export function getBlogPageMap(): PageMapItem[] {
    const internal = (globalThis as any)[NEXTRA_INTERNAL] as NextraInternal;

    const blog = internal.pageMap.find(
        (item) => item.kind === "Folder" && item.route === "/blog"
    );

    return (blog as Folder)?.children || [];
}
