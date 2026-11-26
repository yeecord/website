"use client";

import { DiscordChat, DiscordMessage } from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
import { Station } from "./DayJourney";
import { ServerCount } from "./ServerCount";

const quotes: { author: string; color: string; text: Phrase }[] = [
  {
    author: "SJay",
    color: "#5865f2",
    text: "複雜的大型伺服器架設，有了機器龍讓繁雜的操作變得簡單，大大減輕了管理難度",
  },
  {
    author: "Money",
    color: "#e8a33d",
    text: "即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用",
  },
  {
    author: "Nathan",
    color: "#23a55a",
    text: "牠簡化了管理流程，大大提高了人員管理的效率",
  },
];

export function Trust({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <Station
      time="22:00"
      tone="dark"
      side="left"
      title={
        <>
          <span className="text-yee-green">
            <ServerCount value={350_000} />
          </span>
          {t("個伺服器的日常")}
        </>
      }
      sentence={t("群主們怎麼說機器龍")}
    >
      <DiscordChat>
        {quotes.map((quote) => (
          <DiscordMessage
            key={quote.author}
            author={quote.author}
            bot={false}
            color={quote.color}
          >
            <p>{t(quote.text)}</p>
          </DiscordMessage>
        ))}
      </DiscordChat>
    </Station>
  );
}
