import { zhCN } from "@fumapress/language/zh-cn";
import { zhTW } from "@fumapress/language/zh-tw";
import { defineI18n } from "fumadocs-core/i18n";
import { defaultLocale, type Locale, localeCodes } from "./locales";

export * from "./locales";

// fumadocs' own UI keys are English source strings, so an empty preset leaves
// them as they are
export const uiPresets: Record<Locale, () => { name: string; value: object }> = {
  "zh-tw": zhTW,
  "zh-cn": zhCN,
  en: () => ({ name: "English", value: {} }),
};

export const i18n = defineI18n({
  languages: localeCodes,
  defaultLanguage: defaultLocale,
});
