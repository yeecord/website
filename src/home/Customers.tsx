import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import LinkButton from "./components/LinkButton";
import clsx from "clsx";
import { motion, type MotionValue, useTransform } from "framer-motion";
import formatter from "@utils/formatter";
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
        <h1 className="heading-xl">
          受超過
          <span className="text-gradient mx-2 block from-pink-600 to-orange-400 max-md:text-7xl md:inline">
            <ServerCount count={count} />
          </span>
          個伺服器使用
        </h1>
        <h3 className="heading-md text-secondary">
          受到無數大型社群的廣泛信任
        </h3>
        <div className="h-stack">
          <LinkButton
            href="/invite"
            className="secondary-button shadow-lg backdrop-blur-lg"
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
        "flex cursor-pointer flex-col gap-3 rounded-xl bg-white p-4 dark:bg-slate-900/70 dark:backdrop-blur-3xl",
        "shadow-2xl shadow-blue-800/30 dark:shadow-black/60",
        "border-[2px] border-gray-300 transition-colors dark:border-slate-800",
        "hover:dark:border-pink-400 hover:dark:bg-slate-900",
      )}
    >
      <div className="h-stack">
        <Image
          alt={author}
          src={icon}
          width="50"
          height="50"
          className="aspect-square rounded-full"
        />
        <div>
          <p className="font-semibold text-pink-700 dark:text-pink-300">
            {title}
          </p>
          <h3 className="heading-md text-black dark:text-white">{author}</h3>
        </div>
      </div>

      <p className="text-secondary dark:text-slate-300 md:text-lg">{content}</p>
    </div>
  );
}
