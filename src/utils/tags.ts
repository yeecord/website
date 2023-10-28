import { allBlog } from "@/app/source";

export type TagInfo = {
  count: number;
};

export function getTagHref(tag: string) {
  return `/blog/tags/${tag.toLowerCase()}`;
}

export function getTags() {
  const map = new Map<string, TagInfo>();

  for (const blog of allBlog) {
    for (const tag of blog.matter.tags) {
      if (map.has(tag)) {
        map.get(tag)!.count++;
      } else {
        map.set(tag, { count: 1 });
      }
    }
  }
  return map;
}
