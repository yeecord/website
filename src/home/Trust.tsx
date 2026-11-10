"use client";

import { type MotionValue, motion, useTransform } from "motion/react";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
import formatter from "~/utils/formatter";
import { useAnimatedCounter } from "./utils/use-animated-counter";

const quotes: { author: string; text: Phrase }[] = [
  {
    author: "SJay",
    text: "複雜的大型伺服器架設，有了機器龍讓繁雜的操作變得簡單，大大減輕了管理難度",
  },
  {
    author: "Money",
    text: "即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用",
  },
  {
    author: "Nathan",
    text: "牠簡化了管理流程，大大提高了人員管理的效率",
  },
];

/** 群主的評價排成跟遊戲裡一樣的對話框 */
export function Trust({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const { count, start } = useAnimatedCounter(350_000, 340_000, 1);

  return (
    <motion.section
      className="home-section"
      onViewportEnter={() => start()}
      viewport={{ once: true }}
    >
      <h2 className="home-heading">
        <ServerCount count={count} />
        {t("個伺服器的日常")}
      </h2>
      <p className="home-lead">{t("群主們怎麼說機器龍")}</p>
      <ul className="home-says">
        {quotes.map((quote) => (
          <li key={quote.author}>
            <cite>{quote.author}</cite>
            {t(quote.text)}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

function ServerCount({ count }: { count: MotionValue<number> }) {
  const rounded = useTransform(count, (value: number) =>
    formatter.format(Math.floor(value)),
  );

  return <motion.strong>{rounded}</motion.strong>;
}
