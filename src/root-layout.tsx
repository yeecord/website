import { zhCN } from "@fumapress/language/zh-cn";
import { zhTW } from "@fumapress/language/zh-tw";
import { defineI18n } from "fumadocs-core/i18n";
import { createRootLayout } from "fumapress/layouts/root";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search-dialog";

export const i18n = defineI18n({
  languages: ["zh-tw", "zh-cn"],
  defaultLanguage: "zh-tw",
});

export const translations = i18n
  .translations()
  .preset("zh-tw", zhTW())
  .preset("zh-cn", zhCN());

// i18n 模式下 fumapress 只把 root layout 掛在 /[lang] 下，
// autoI18n: false 的頁面（/install、404）透過 src/pages/_layout.tsx 掛同一個，
// /zh-cn 底下的則由 src/zh-cn-plugin.tsx 自己掛，才拿得到正確的 lang。
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
