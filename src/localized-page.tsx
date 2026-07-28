import { LanguagesIcon } from "lucide-react";
import { canonicalUrl, domain } from "~/config";
import {
  defaultLocale,
  type Locale,
  localeCodes,
  locales,
  staticPath,
} from "~/i18n";
import { baseOptions } from "~/layout-config";

/**
 * Layout props for a static page that exists in every language. The built-in
 * language switch only prepends a locale prefix, which would send the
 * prefix-less default language to a nonexistent /zh-tw, so it is replaced by
 * plain links to the same page in the other languages.
 */
export function localizedLayout(locale: Locale, path = "") {
  const options = baseOptions(locale);

  return {
    ...options,
    slots: { languageSelect: false as const },
    links: [
      ...options.links,
      ...localeCodes
        .filter((code) => code !== locale)
        .map((code) => ({
          url: `${staticPath(code, path)}/`.replace(/\/\/$/, "/"),
          text: locales[code].label,
          icon: <LanguagesIcon />,
        })),
    ],
  };
}

export function LocalizedMeta({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl(staticPath(locale, path))} />
      {localeCodes.map((code) => (
        <link
          key={code}
          rel="alternate"
          hrefLang={locales[code].hreflang}
          href={canonicalUrl(staticPath(code, path))}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={canonicalUrl(staticPath(defaultLocale, path))}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
    </>
  );
}
