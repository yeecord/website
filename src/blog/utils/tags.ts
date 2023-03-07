import { MdxFile, PageMapItem } from "nextra";

interface RawPage extends MdxFile {
  children?: RawPage[];
}

const flattenPageMap = (page: RawPage, result: PageMapItem[] = []) => {
  if (Array.isArray(page.children!)) {
    page.children.forEach((p) => flattenPageMap(p, result));
  }
  result.push(page);
};

const flattenPageMaps = (pages: RawPage[], result: PageMapItem[] = []) => {
  pages.forEach((v) => flattenPageMap(v, result));
};

export const getStaticTags = (pageMap: PageMapItem[]) => {
  const result: RawPage[] = [];
  flattenPageMaps(pageMap as RawPage[], result);
  return Array.from(new Set(result.map(getTags).flat(1).filter(Boolean)));
};

export type TagInfo = {
  count: number;
};

export const getStaticTagsMap = (pageMap: PageMapItem[]) => {
  const result: RawPage[] = [];
  flattenPageMaps(pageMap as RawPage[], result);
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
