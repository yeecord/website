import { defaultLocale, type Locale } from "./locales";
import { en } from "./translations/en";
import { zhCn } from "./translations/zh-cn";

/**
 * A string as it is written in the source, which is also its key. zh-tw is the
 * source language, so it has no table of its own.
 */
export type Phrase = keyof typeof zhCn;

const tables = { "zh-cn": zhCn, en } satisfies Record<
  Exclude<Locale, typeof defaultLocale>,
  Record<Phrase, string>
>;

export type Translate = (phrase: Phrase) => string;

export function translator(locale: Locale): Translate {
  if (locale === defaultLocale) return (phrase) => phrase;

  const table = tables[locale];

  return (phrase) => table[phrase];
}

/**
 * Picks a component's own table for the locale, falling back to the source
 * language. Used by the docs demos, whose copy follows the docs themselves.
 */
export function localized<T extends Partial<Record<Locale, unknown>>>(
  table: T,
  locale: Locale,
): NonNullable<T[typeof defaultLocale]> {
  return (table[locale] ??
    table[defaultLocale]) as NonNullable<T[typeof defaultLocale]>;
}
