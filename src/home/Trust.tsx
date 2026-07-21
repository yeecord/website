"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { DiscordChat, DiscordMessage } from "@/components/mdx/discord";
import formatter from "@/utils/formatter";
import { useAnimatedCounter } from "./utils/use-animated-counter";

export function Trust() {
  const { count, start } = useAnimatedCounter(
    350_000,
    Math.max(350_000 - 10000, 0),
    1,
  );

  return (
    <motion.div
      whileInView="show"
      onViewportEnter={() => start()}
      initial="hidden"
      viewport={{ once: true }}
      variants={{
        show: { y: 0, opacity: 1 },
        hidden: { y: 20, opacity: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="z-[2] mt-40 flex flex-col items-center gap-6 text-center"
    >
      <h2 className="font-bold text-4xl tracking-tight sm:text-5xl">
        <span className="text-primary">
          <ServerCount count={count} />
        </span>
        個伺服器的日常
      </h2>
      <p className="text-lg text-muted-foreground sm:text-xl">
        群主們怎麼說機器龍
      </p>
      <div className="mx-auto w-full max-w-[44rem] text-start">
        <DiscordChat>
          <DiscordMessage author="SJay" bot={false} color="#5865f2">
            <p>
              複雜的大型伺服器架設，有了機器龍讓繁雜的操作變得簡單，大大減輕了管理難度
            </p>
          </DiscordMessage>
          <DiscordMessage author="Money" bot={false} color="#e8a33d">
            <p>即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用</p>
          </DiscordMessage>
          <DiscordMessage author="Nathan" bot={false} color="#23a55a">
            <p>牠簡化了管理流程，大大提高了人員管理的效率</p>
          </DiscordMessage>
        </DiscordChat>
      </div>
    </motion.div>
  );
}

function ServerCount({ count }: { count: MotionValue<number> }) {
  const rounded = useTransform(count, (v: number) =>
    formatter.format(Math.floor(v)),
  );

  return <motion.span>{rounded}</motion.span>;
}
