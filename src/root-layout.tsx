import { createRootLayout } from "fumapress/layouts/root";
import type { ReactNode } from "react";
import SearchDialog from "~/components/search-dialog";
import { i18n, localeCodes, uiPresets } from "~/i18n";

export const translations = localeCodes.reduce(
  (builder, locale) => builder.preset(locale, uiPresets[locale]()),
  i18n.translations(),
);

// i18n 模式下 fumapress 只把 root layout 掛在 /[lang] 下，
// autoI18n: false 的頁面（/install、404）透過 src/pages/_layout.tsx 掛同一個，
// 其他語系的靜態頁則由 src/localized-pages-plugin.tsx 自己掛，才拿得到正確的 lang。
const BaseRootLayout = createRootLayout({
  providerProps: {
    search: {
      SearchDialog,
    },
    theme: {
      hotKey: false,
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
