import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { InstallPicker } from "~/components/install/picker";
import { footer } from "~/config";
import { NeonTitle } from "~/home/NeonTitle";
import { Sky } from "~/home/stall/Sky";
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
      <main className="dark night overflow-x-clip">
        <Sky />
        <div className="relative mx-auto w-full max-w-5xl px-4 pt-20 pb-28">
          <NeonTitle lines={[t("要恐龍做什麼，"), t("勾起來")]} />
          <p className="mx-auto mt-3 mb-8 max-w-md text-pretty text-center text-[#e7dbbe] text-base sm:text-lg">
            {t("權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。")}
          </p>
          <InstallPicker locale={locale} />
        </div>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
