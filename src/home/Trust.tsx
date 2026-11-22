"use client";

import { motion } from "motion/react";
import { DiscordChat, DiscordMessage } from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
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
    <motion.div
      whileInView="show"
      initial="hidden"
      viewport={{ once: true }}
      variants={{
        show: { y: 0, opacity: 1 },
        hidden: { y: 20, opacity: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="z-[2] mt-24 flex flex-col items-center gap-6 text-center sm:mt-40"
    >
      <h2 className="text-balance font-bold text-3xl tracking-tight sm:text-5xl">
        <span className="text-primary">
          <ServerCount value={350_000} />
        </span>
        {t("個伺服器的日常")}
      </h2>
      <p className="text-lg text-muted-foreground sm:text-xl">
        {t("群主們怎麼說機器龍")}
      </p>
      <div className="mx-auto w-full max-w-[44rem] text-start">
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
      </div>
    </motion.div>
  );
}
