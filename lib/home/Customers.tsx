import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import LinkButton from "./components/LinkButton";
import clsx from "clsx";
import { motion, MotionValue, useTransform } from "framer-motion";
import formatter from "@utils/formatter";
import { useAnimatedCounter } from "./utils/use-animated-counter";

export function Customers({ usedBy }: { usedBy: number }) {
    const { count, start } = useAnimatedCounter(
        usedBy,
        Math.max(usedBy - 10000, 0),
        1
    );

    return (
        <div className="relative mt-[10rem] z-[2]">
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
                className="flex flex-col gap-5 items-center text-center"
            >
                <h1 className="heading-xl">
                    受超過
                    <span className="block max-md:text-7xl md:inline text-gradient from-pink-600 to-orange-400 mx-2">
                        <ServerCount count={count} />
                    </span>
                    個伺服器使用
                </h1>
                <h3 className="heading-md text-secondary">
                    受到無數大型社區的廣泛信任
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-start md:mt-[4rem]"
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
                        content="即使我不懂英語，無需繁雜的理解及操作，我仍然可以輕鬆使用 YEE式機器龍"
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
                    "relative w-full -z-[1] -mt-[10rem] md:-mt-[1rem] h-[300px] object-cover custom",
                    "[mask-image:_linear-gradient(to_right,_transparent,white_10%,white_70%,_transparent)]"
                )}
                alt="wave"
                src={PinkWave}
            />
        </div>
    );
}

function ServerCount({ count }: { count: MotionValue<number> }) {
    const rounded = useTransform(count, (v: number) =>
        formatter.format(Math.floor(v))
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
                "flex flex-col gap-3 p-4 bg-white dark:bg-slate-900/70 dark:backdrop-blur-3xl rounded-xl cursor-pointer",
                "shadow-2xl shadow-blue-800/30 dark:shadow-black/60",
                "transition-colors border-[2px] border-gray-300 dark:border-slate-800",
                "hover:dark:bg-slate-900 hover:dark:border-pink-400",
                "text-secondary dark:text-slate-300 hover:dark:text-slate-400"
            )}
        >
            <div className="h-stack">
                <Image
                    alt={author}
                    src={icon}
                    width="50"
                    height="50"
                    className="rounded-full aspect-square"
                />
                <div>
                    <p className="text-pink-700 dark:text-pink-300">{title}</p>
                    <h3 className="heading-md text-black dark:text-white">
                        {author}
                    </h3>
                </div>
            </div>

            <p className="md:text-lg flex-1">{content}</p>
        </div>
    );
}
