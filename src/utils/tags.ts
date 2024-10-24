import { blog } from "@/app/source";

export type TagInfo = {
  count: number;
};

export function getTagHref(tag: string) {
  return `/blog/tags/${encodeURIComponent(tag.toLowerCase())}`;
}

export function getTags() {
  const map = new Map<string, TagInfo>();

  for (const page of blog.getPages()) {
    for (const tag of page.data.tags) {
      const record = map.get(tag);

      if (record) {
        record.count++;
      } else {
        map.set(tag, { count: 1 });
      }
    }
  }
  return map;
}
