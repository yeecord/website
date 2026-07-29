import { canonicalUrl, domain } from "~/config";
import {
  defaultLocale,
  type Locale,
  localeCodes,
  locales,
  staticPath,
} from "~/i18n";
import { baseOptions } from "~/layout-config";

export function localizedLayout(locale: Locale) {
  return baseOptions(locale);
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
