import { contentPath, type Locale } from "~/i18n";

export function getTagHref(locale: Locale, tag: string) {
  return contentPath(locale, `/blog/tags/${encodeURIComponent(tag.toLowerCase())}`);
}
