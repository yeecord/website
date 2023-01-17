import { BlogPage } from "@utils/mdx";
import { MdxFile, PageMapItem } from "nextra";

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
export default function getTags(page: MdxFile) {
    if (!page.frontMatter) {
        return [];
    }

    return page.frontMatter.tags?.map((tag: string) => tag.toLowerCase()) || [];
}
