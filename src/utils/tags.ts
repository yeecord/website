export function getTagHref(tag: string) {
  return `/blog/tags/${encodeURIComponent(tag.toLowerCase())}`;
}
