"use client";

import { type MotionValue, motion, useTransform } from "motion/react";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
import formatter from "~/utils/formatter";
import { useAnimatedCounter } from "./utils/use-animated-counter";

const quotes: { author: string; tilt: number; text: Phrase }[] = [
  {
    author: "SJay",
    tilt: -2.5,
    text: "複雜的大型伺服器架設，有了機器龍讓繁雜的操作變得簡單，大大減輕了管理難度",
  },
  {
    author: "Money",
    tilt: 1.5,
    text: "即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用",
  },
  {
    author: "Nathan",
    tilt: -1,
    text: "牠簡化了管理流程，大大提高了人員管理的效率",
  },
];

export function Trust({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const { count, start } = useAnimatedCounter(350_000, 340_000, 1);

  return (
    <motion.section
      className="board"
      onViewportEnter={() => start()}
      viewport={{ once: true }}
    >
      <h2 className="night-heading">
        <ServerCount count={count} />
        {t("個伺服器的日常")}
      </h2>
      <p className="night-lead">{t("群主們怎麼說機器龍")}</p>
      <ul>
        {quotes.map((quote, index) => (
          <motion.li
            key={quote.author}
            initial={{ opacity: 0, y: -40, rotate: quote.tilt * 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: quote.tilt }}
            whileHover={{ rotate: 0, y: -4 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              duration: 0.7,
              bounce: 0.4,
              delay: index * 0.09,
            }}
          >
            <p>{t(quote.text)}</p>
            <footer>{quote.author}</footer>
          </motion.li>
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
