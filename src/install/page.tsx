import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { InstallPicker } from "~/components/install/picker";
import { footer } from "~/config";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

export function InstallPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("安裝 YEE 式機器龍")}
        description={t(
          "權限自己勾，勾多少拿多少。也可以裝到自己的帳號上，私訊和任何伺服器都能用。",
        )}
      />
      <main className="dark night night-page">
        <div className="mx-auto w-full max-w-5xl px-4 pt-14 pb-28">
          <h1 className="night-heading">{t("要恐龍做什麼，勾起來")}</h1>
          <p className="night-lead mt-2 mb-8 max-w-xl text-pretty">
            {t("權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。")}
          </p>
          <InstallPicker locale={locale} />
        </div>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
