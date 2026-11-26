import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ComponentType } from "react";
import Footer from "~/components/Footer";
import {
  AutoChannelsDemo,
  GiveawayFlowDemo,
  PollFlowDemo,
  RoleMenuDemo,
} from "~/components/mdx/feature-flows";
import { FormFlowDemo } from "~/components/mdx/form-flow";
import { footer } from "~/config";
import { Community } from "~/home/Community";
import { DayJourney, Station } from "~/home/DayJourney";
import { Hero } from "~/home/Hero";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

/* 每個時段一個功能，示範直接用說明文件裡的同一套，跟機器龍真正的回覆一致 */
const hours: {
  time: string;
  title: Phrase;
  sentence: Phrase;
  tone: "light" | "dark";
  Demo: ComponentType<{ locale?: Locale }>;
}[] = [
  { time: "07:00", title: "身分組", sentence: "新成員進來自動發，或讓成員自己按按鈕領。", tone: "light", Demo: RoleMenuDemo },
  { time: "10:00", title: "表單", sentence: "成員按一顆按鈕，就能私下找管理員，結案後自動封存。", tone: "light", Demo: FormFlowDemo },
  { time: "12:00", title: "抽獎", sentence: "辦抽獎，一條指令的事", tone: "light", Demo: GiveawayFlowDemo },
  { time: "15:00", title: "投票", sentence: "最多 18 個選項，可以匿名，結果能匯出", tone: "light", Demo: PollFlowDemo },
  { time: "18:00", title: "動態語音頻道", sentence: "有人進語音就開一間專屬房間，人走了自動收。", tone: "dark", Demo: AutoChannelsDemo },
];

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
          {hours.map(({ time, title, sentence, tone, Demo }, i) => (
            <Station
              key={time}
              time={time}
              tone={tone}
              side={i % 2 ? "left" : "right"}
              title={t(title)}
              sentence={t(sentence)}
            >
              <Demo locale={locale} />
            </Station>
          ))}
          <Community locale={locale} />
        </DayJourney>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
