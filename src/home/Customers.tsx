"use client";

import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import LinkButton from "./components/LinkButton";
import clsx from "clsx";
import { motion, type MotionValue, useTransform } from "framer-motion";
import formatter from "@/utils/formatter";
import { useAnimatedCounter } from "./utils/use-animated-counter";

export function Customers({ usedBy }: { usedBy: number }) {
  const { count, start } = useAnimatedCounter(
    usedBy,
    Math.max(usedBy - 10000, 0),
    1,
  );

  return (
    <div className="relative z-[2] mt-[10rem]">
      <motion.div
        whileInView="show"
        onViewportEnter={() => start()}
        initial="hidden"
        transition={{
          duration: 0.5,
          delayChildren: 0.01,
        }}
        viewport={{ once: true }}
        variants={{
          show: {
            y: 0,
            opacity: 1,
          },
          hidden: {
            y: 20,
            opacity: 0,
          },
        }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <p
          className={clsx(
            "mx-auto mb-8 w-fit rounded-md bg-gradient-to-br from-orange-400 to-orange-500 px-6 py-2 text-xl font-semibold text-white sm:text-3xl",
          )}
        >
          倍受信賴
        </p>
        <h1 className="text-5xl font-bold">
          受超過
          <span className="mx-2 block bg-gradient-to-b from-pink-600 to-orange-400 bg-clip-text text-transparent max-md:text-7xl md:inline">
            <ServerCount count={count} />
          </span>
          個伺服器使用
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          受到無數大型社群的廣泛信任
        </p>
        <div className="flex flex-row gap-2.5">
          <LinkButton
            href="/invite"
            className={clsx(
              "rounded-full bg-secondary px-6 py-3 text-lg font-medium text-secondary-foreground shadow-lg transition-all hover:bg-accent hover:text-accent-foreground",
            )}
          >
            邀請機器人
          </LinkButton>
        </div>
        <motion.div
          className="grid grid-cols-1 gap-4 text-start sm:grid-cols-2 md:mt-[4rem] lg:grid-cols-3"
          variants={{
            show: {
              opacity: 1,
            },
            hidden: {
              opacity: 0,
            },
          }}
        >
          <Comment
            icon="/blog/sjay.png"
            author="SJay"
            title="大型社群領袖"
            content="複雜的大型伺服器架設，有了機器龍讓繁雜的操作變得簡單，大大減輕了管理難度，任何附加功能使用起來無往不利"
          />
          <Comment
            icon="/blog/money.jpg"
            author="Money"
            title="活躍協作者"
            content="即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用 YEE 式機器龍"
          />
          <Comment
            icon="/blog/nathan.jpg"
            author="Nathan"
            title="伺服器管理員"
            content="機器龍對我們服務器有很大的幫助，牠簡化了管理流程，大大提高了人員管理的效率"
          />
        </motion.div>
      </motion.div>
      <Image
        className={clsx(
          "custom relative -z-[1] -mt-[10rem] h-[300px] w-full object-cover md:-mt-[1rem]",
          "[mask-image:linear-gradient(to_right,_transparent,white_10%,white_70%,_transparent)]",
        )}
        alt="wave"
        src={PinkWave}
      />
    </div>
  );
}

function ServerCount({ count }: { count: MotionValue<number> }) {
  const rounded = useTransform(count, (v: number) =>
    formatter.format(Math.floor(v)),
  );

  return <motion.span>{rounded}</motion.span>;
}

function Comment({
  icon,
  author,
  title,
  content,
}: {
  icon: string;
  author: string;
  title: string;
  content: string;
}) {
  return (
    <div
      className={clsx(
        "flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 shadow-2xl shadow-blue-800/30 transition-colors dark:shadow-black/60 dark:backdrop-blur-3xl",
        "hover:bg-accent hover:text-accent-foreground hover:dark:border-pink-400",
      )}
    >
      <div className="flex flex-row gap-2.5">
        <Image
          alt={author}
          src={icon}
          width="50"
          height="50"
          className="aspect-square rounded-full"
        />
        <div>
          <p className="text-pink-700 dark:text-pink-300">{title}</p>
          <p className="text-lg font-bold text-black dark:text-white sm:text-xl">
            {author}
          </p>
        </div>
      </div>

      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}
