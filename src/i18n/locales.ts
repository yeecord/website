// Every language the site ships. Adding one here is what makes it appear in the
// nav, the hreflang set, the search index and the generated static routes.
export const locales = {
  "zh-tw": { label: "繁體中文", hreflang: "zh-Hant", cjk: true },
  "zh-cn": { label: "简体中文", hreflang: "zh-Hans", cjk: true },
  en: { label: "English", hreflang: "en", cjk: false },
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale = "zh-tw" satisfies Locale;

export const localeCodes = Object.keys(locales) as Locale[];

export function toLocale(lang: string | undefined): Locale {
  return localeCodes.find((code) => code === lang) ?? defaultLocale;
}

/** Content routes always carry their prefix, including the default language. */
export function contentPath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

/** Static pages keep the default language at the root, so `/` stays the home. */
export function staticPath(locale: Locale, path = "") {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return `${prefix}${path}` || "/";
}
