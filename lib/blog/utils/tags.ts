import { RawBlogPage } from "@utils/mdx";
import { MdxFile, PageMapItem } from "nextra";

interface Page extends RawBlogPage {
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

export function getTags(page: MdxFile) {
    if (!page.frontMatter) {
        return [];
    }

    return page.frontMatter.tags?.map((tag: string) => tag.toLowerCase()) || [];
}

export function getTagHref(tag: string) {
    return `/blog/tags/${tag.toLowerCase()}`;
}
