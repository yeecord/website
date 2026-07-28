"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { DiscordChat, DiscordMessage } from "~/components/mdx/discord";
import formatter from "~/utils/formatter";
import type { HomeCopy } from "./copy";
import { useAnimatedCounter } from "./utils/use-animated-counter";

export function Trust({ copy }: { copy: HomeCopy }) {
  const c = copy.trust;
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
      className="z-[2] mt-24 flex flex-col items-center gap-6 text-center sm:mt-40"
    >
      <h2 className="text-balance font-bold text-3xl tracking-tight sm:text-5xl">
        <span className="text-primary">
          <ServerCount count={count} />
        </span>
        {c.headingSuffix}
      </h2>
      <p className="text-lg text-muted-foreground sm:text-xl">{c.subheading}</p>
      <div className="mx-auto w-full max-w-[44rem] text-start">
        <DiscordChat>
          {c.quotes.map((quote) => (
            <DiscordMessage
              key={quote.author}
              author={quote.author}
              bot={false}
              color={quote.color}
            >
              <p>{quote.text}</p>
            </DiscordMessage>
          ))}
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
