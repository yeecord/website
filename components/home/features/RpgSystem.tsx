import clsx from "clsx";
import { motion } from "framer-motion";
import { Step } from "./Step";
import global from "./features.module.css";
import styles from "./rpg.module.css";
import { RiGameFill } from "react-icons/ri";
import { LinkButton } from "@components/LinkButton";

export function RpgSystem() {
    return (
        <div
            className={clsx(
                "w-full min-h-[50rem] pr-8 pt-[10rem] pb-10",
                styles["steps-container"]
            )}
        >
            <motion.div
                className="sticky flex flex-col xl:flex-row gap-5 top-[20vh]"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "linear" }}
            >
                <Step
                    icon={{
                        className:
                            "bg-gradient-to-br from-orange-400 to-pink-600 shadow-purple-400",
                        children: <RiGameFill className="inline" />,
                    }}
                    className={clsx(
                        "flex flex-col-reverse rounded-2xl gap-5",
                        "md:flex-row md:justify-between md:p-8 md:bg-slate-100 md:dark:bg-slate-900"
                    )}
                >
                    <div>
                        <h1 className={`${global.heading} mb-2`}>
                            不只是聊天平台
                        </h1>
                        <h3 className="heading-md text-secondary">
                            透過機器人各種有趣的系統，讓你的 Discord
                            更加有趣，同時朋友也可以和你一起玩
                        </h3>
                        <LinkButton
                            className="primary-button mt-4 from-orange-400 to-pink-500"
                            href="/docs/rpg/"
                        >
                            了解更多
                        </LinkButton>
                    </div>

                    <div
                        className={clsx(
                            "rounded-2xl -mt-10 fill-black dark:fill-white",
                            "md:bg-pink-500 md:px-7 md:py-5 md:mt-0 md:fill-white"
                        )}
                    >
                        <DinoSvg />
                    </div>
                </Step>
            </motion.div>
        </div>
    );
}

function DinoSvg() {
    return (
        <svg
            width="144"
            height="144"
            viewBox="0 0 144 144"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0,142L8,142L8,144L0,144L0,142ZM28,142L32,142L32,144L28,144L28,142ZM96,142L104,142L104,144L96,144L96,142ZM80,100L76,100L76,114L72,114L72,120L68,120L68,124L64,124L64,140L68,140L68,144L60,144L60,132L56,132L56,128L52,128L52,132L48,132L48,136L44,136L44,140L48,140L48,144L40,144L40,128L36,128L36,124L32,124L32,120L28,120L28,116L24,116L24,112L20,112L20,88L24,88L24,96L28,96L28,100L32,100L32,104L40,104L40,100L44,100L44,96L50,96L50,92L56,92L56,88L60,88L60,62L64,62L64,58L96,58L96,62L100,62L100,80L80,80L80,84L92,84L92,88L76,88L76,96L84,96L84,104L80,104L80,100ZM82,140L84,140L84,142L82,142L82,140ZM12,136L20,136L20,138L12,138L12,136ZM110,134L116,134L116,136L110,136L110,134ZM0,128L32,128L32,130L0,130L0,128ZM72,128L128,128L128,130L72,130L72,128ZM68,64L68,68L72,68L72,64L68,64Z"
                stroke="none"
            />
        </svg>
    );
}
