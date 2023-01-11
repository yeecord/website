import clsx from "clsx";
import { motion } from "framer-motion";
import { BsCheckCircleFill, BsTranslate } from "react-icons/bs";
import styles from "./features.module.css";
import cn_styles from "./chinese.module.css";

import { Step } from "./Step";

export function ChineseUI() {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "linear" }}
            className={clsx(
                "w-full mt-20 min-h-[40rem] pr-8",
                cn_styles["steps-container"]
            )}
        >
            <div className="sticky flex flex-col xl:flex-row gap-5 top-[20vh]">
                <Step
                    icon={{
                        className:
                            "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-400",
                        children: <BsTranslate className="inline" />,
                    }}
                >
                    <h1 className={`${styles.heading} mb-2`}>全中文化界面</h1>
                    <h3 className="heading-md text-secondary">
                        我們提供了全中文化的界面，讓不懂英文的各位也有好用的機器人
                    </h3>
                    <div className="flex flex-col gap-3 mt-8">
                        <Feature>通俗易懂的文字</Feature>
                        <Feature>無需專業知識</Feature>
                    </div>
                </Step>
                <Skeleton />
            </div>
        </motion.div>
    );
}

function Feature({ children }: { children: string }) {
    return (
        <div className="h-stack">
            <BsCheckCircleFill className="text-3xl sm:text-4xl text-green-500 dark:text-green-400" />
            <p className="text-xl sm:text-2xl">{children}</p>
        </div>
    );
}

function Skeleton() {
    const foreground = "bg-slate-300 dark:bg-slate-700 rounded-full";
    const skeleton = "rounded-full bg-slate-200 dark:bg-slate-700 h-7";

    return (
        <div
            className={clsx(
                "flex-1 aspect-[6/3] p-5 rounded-lg bg-slate-100 dark:bg-slate-900 min-w-[20rem]",
                "grid grid-cols-[0.5fr_1fr] gap-6",
                "shadow-2xl"
            )}
        >
            <div className="bg-white dark:bg-slate-800 rounded-md flex-1 p-4 flex flex-col gap-4">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
            </div>
            <div className="text-xl font-bold flex flex-col gap-4">
                <h2 className="heading-md">中文</h2>
                <div className={`${foreground} h-7`} />
                <div className={`${foreground} h-6 w-[70%]`} />
                <div className="rounded-lg bg-slate-200 dark:bg-slate-800 h-10 mt-auto" />
            </div>
        </div>
    );
}
