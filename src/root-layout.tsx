import { zhCN } from "@fumapress/language/zh-cn";
import { zhTW } from "@fumapress/language/zh-tw";
import { defineI18n } from "fumadocs-core/i18n";
import { createRootLayout } from "fumapress/layouts/root";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search-dialog";

export const i18n = defineI18n({
  languages: ["zh-tw", "zh-cn"],
  defaultLanguage: "zh-tw",
  hideLocale: "default-locale",
});

export const translations = i18n
  .translations()
  .preset("zh-tw", zhTW())
  .preset("zh-cn", zhCN());

// i18n 模式下 fumapress 只把 root layout 掛在 /[lang] 下，
// autoI18n: false 的頁面（首頁、404）要透過 src/pages/_layout.tsx 掛同一個。
// 不自己設 i18n，讓 fumapress 用每頁正確的 lang 自動填入（onLocaleChange 由 localeSwitchPlugin 注入）。
const BaseRootLayout = createRootLayout({
  providerProps: {
    search: {
      SearchDialog,
    },
  },
});

export function RootLayout({
  lang,
  children,
}: {
  lang?: string;
  children: ReactNode;
}) {
  return <BaseRootLayout lang={lang}>{children}</BaseRootLayout>;
}
