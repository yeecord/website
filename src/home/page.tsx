import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import { channels } from "~/home/channels";
import { Community } from "~/home/Community";
import { DayJourney, Station } from "~/home/DayJourney";
import { DemoChannel } from "~/home/DemoServer";
import { Hero } from "~/home/Hero";
import { Trust } from "~/home/Trust";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

const hours = [
  { id: "welcome", time: "07:00", tone: "light", side: "right" },
  { id: "lottery", time: "12:00", tone: "light", side: "left" },
  { id: "voice", time: "18:00", tone: "dark", side: "right" },
] as const;

export function HomePage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("Yeecord - 萬中選一的 Discord 機器人")}
        description={t(
          "YEE 式機器龍用全中文介面提供抽獎、身分組和動態語音，已有 35 萬個伺服器安裝",
        )}
      />
      <main className="overflow-x-clip">
        <Hero locale={locale} />
        <DayJourney label={t("機器龍的一天")}>
          <div className="mx-auto flex min-h-[60svh] w-full max-w-[1100px] flex-col justify-end gap-3 px-4 pt-32 md:px-6">
            <h2 className="font-bold text-4xl text-day-ink tracking-tight sm:text-6xl dark:text-white">
              {t("進來參觀一下")}
            </h2>
            <p className="max-w-xl text-pretty text-day-ink/75 text-lg sm:text-xl dark:text-white/75">
              {t(
                "用指令打開歡迎訊息、身分組或抽獎的設定卡，再選項目、填資料，不用記一串參數",
              )}
            </p>
          </div>
          {hours.map(({ id, time, tone, side }) => (
            <Station
              key={id}
              time={time}
              tone={tone}
              side={side}
              title={t(channels[id].name)}
              sentence={t(channels[id].topic)}
            >
              <DemoChannel locale={locale} id={id} />
            </Station>
          ))}
          <Trust locale={locale} />
          <Community locale={locale} />
        </DayJourney>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
