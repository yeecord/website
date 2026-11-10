import Link from "fumadocs-core/link";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { InstallPicker } from "~/components/install/picker";
import { footer } from "~/config";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

export function InstallCustomPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("自己挑機器龍的功能")}
        description={t(
          "權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。",
        )}
      />
      <main className="install">
        <Link href={`${staticPath(locale, "/install")}/`} className="install-back">
          {t("回到預設組合")}
        </Link>
        <h1>{t("要恐龍做什麼，勾起來")}</h1>
        <p className="install-lead">
          {t("權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。")}
        </p>
        <InstallPicker locale={locale} />
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
