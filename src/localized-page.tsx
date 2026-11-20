import type { HeadTag } from "fumapress";
import { canonicalUrl, domain } from "~/config";
import {
  defaultLocale,
  type Locale,
  localeCodes,
  locales,
  staticPath,
} from "~/i18n";
import { baseOptions } from "~/layout-config";

/** Paths of the pages every language serves, without the language prefix. */
const staticPaths = new Set(["/", "/install", "/dashboard"]);

export function localizedLayout(locale: Locale) {
  return baseOptions(locale);
}

/** Canonical and `hreflang` links of a static page, whose default language lives at the bare path. */
export function staticPageLinks(path: string): HeadTag[] | undefined {
  const [, prefix = "", ...rest] = path.split("/");
  const locale = localeCodes.find((code) => code === prefix);
  const page = locale ? `/${rest.join("/")}` : path;

  if (!staticPaths.has(page)) {
    return;
  }

  const href = (code: Locale) =>
    canonicalUrl(staticPath(code, page === "/" ? "" : page));
  const canonical = href(locale ?? defaultLocale);

  return [
    { tag: "link", attrs: { rel: "canonical", href: canonical } },
    { tag: "meta", attrs: { property: "og:url", content: canonical } },
    ...localeCodes.map((code): HeadTag => ({
      tag: "link",
      attrs: {
        rel: "alternate",
        hreflang: locales[code].hreflang,
        href: href(code),
      },
    })),
    {
      tag: "link",
      attrs: {
        rel: "alternate",
        hreflang: "x-default",
        href: href(defaultLocale),
      },
    },
  ];
}

export function LocalizedMeta({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
    </>
  );
}
