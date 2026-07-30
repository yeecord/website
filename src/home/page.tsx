import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import { Community } from "~/home/Community";
import { DemoServer } from "~/home/DemoServer";
import { Hero } from "~/home/Hero";
import { Trust } from "~/home/Trust";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

export function HomePage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        locale={locale}
        title={t("Yeecord - 萬中選一的 Discord 機器人")}
        description={t(
          "YEE 式機器龍用全中文介面提供抽獎、身分組、動態語音和找吃的小遊戲，已有 35 萬個伺服器安裝。",
        )}
      />
      <main className="overflow-x-clip">
        <Hero locale={locale} />
        <div className="mx-auto flex max-w-[1100px] flex-col px-3 md:px-6">
          <DemoServer locale={locale} />
          <Trust locale={locale} />
        </div>
        <Community locale={locale} />
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
