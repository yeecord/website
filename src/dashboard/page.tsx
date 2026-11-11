import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { Dashboard } from "~/components/dashboard/dashboard";
import { footer } from "~/config";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

export function DashboardPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("伺服器設定")}
        description={t("登入後可以看每個伺服器開了哪些功能、哪些出了問題。")}
      />
      <main className="mx-auto w-full max-w-5xl px-4 pt-12 pb-24">
        <h1 className="mb-8 font-bold text-3xl tracking-tight">{t("伺服器設定")}</h1>
        <Dashboard locale={locale} />
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
