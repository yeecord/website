import { Dashboard } from "~/components/dashboard/dashboard";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { LocalizedMeta } from "~/localized-page";

export function DashboardPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <>
      <LocalizedMeta
        title={t("伺服器設定")}
        description={t("登入後可以看每個伺服器開了哪些功能、哪些出了問題。")}
      />
      <h1 className="sr-only">{t("伺服器設定")}</h1>
      <Dashboard locale={locale} />
    </>
  );
}
