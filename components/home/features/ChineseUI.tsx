import clsx from "clsx";
import { motion } from "framer-motion";
import styles from "./features.module.css";
import cn_styles from "./chinese.module.css";
import Step from "../internal/Step";
import Gradient from "../internal/Gradient";

import { BsCheckCircleFill, BsTranslate } from "react-icons/bs";
import GardientSvg from "@static/home/purple-gradient.svg";

export function ChineseUI() {
    return (
        <div
            className={clsx(
                "w-full mt-20 min-h-[140vh] sm:min-h-[150vh] xl:min-h-[110vh] pr-8",
                cn_styles["steps-container"]
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
                            "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-400",
                        children: <BsTranslate className="inline" />,
                    }}
                    className="relative z-[2]"
                >
                    <h1 className={`${styles.heading} mb-2`}>全中文化界面</h1>
                    <h3 className="heading-md text-secondary">
                        我們提供了全中文化的界面，讓英文不再成為優質機器人的隔閡
                    </h3>
                    <div className="flex flex-col gap-3 mt-8">
                        <Feature>通俗易懂的文檔</Feature>
                        <Feature>無需繁雜的操作</Feature>
                    </div>
                </Step>
                <Skeleton />
                <Gradient
                    src={GardientSvg}
                    className={clsx(
                        "absolute left-0 -bottom-[14rem] w-[50rem] max-w-none -z-[1]",
                        "xl:right-0 xl:-top-[12rem] xl:left-[initial] xl:bottom-[initial]"
                    )}
                />
            </motion.div>
        </div>
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
    const list = {
        show: { transition: { staggerChildren: 0.1 } },
        hidden: {},
    };
    const item = {
        show: {
            scaleX: 1,
            opacity: 1,
        },
        hidden: {
            scaleX: 0,
            opacity: 0,
        },
    };

    return (
        <div
            className={clsx(
                "flex-1 aspect-[6/3] p-5 rounded-lg bg-slate-100 dark:bg-slate-900 min-w-[26rem] min-h-[15rem] max-w-[45rem]",
                "grid grid-cols-[0.5fr_1fr] gap-6",
                "shadow-xl relative"
            )}
        >
            <motion.div
                className="bg-white dark:bg-slate-800 rounded-md flex-1 p-4 flex flex-col gap-4"
                variants={list}
                initial="hidden"
                whileInView="show"
            >
                <motion.div
                    className={skeleton}
                    variants={item}
                    transition={{ duration: 0.5 }}
                />
                <motion.div
                    className={skeleton}
                    variants={item}
                    transition={{ duration: 0.5 }}
                />
                <motion.div
                    className={skeleton}
                    variants={item}
                    transition={{ duration: 0.5 }}
                />
            </motion.div>
            <motion.div
                className="text-xl font-bold flex flex-col gap-4"
                whileInView={{ paddingRight: "0px", opacity: 1 }}
                initial={{ paddingRight: "100px", opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <h2 className="heading-md">指令區</h2>
                <div className={`${foreground} h-7`} />
                <div className={`${foreground} h-6 w-[70%]`} />
                <div className="rounded-lg bg-slate-200 dark:bg-slate-800 h-10 mt-auto" />
            </motion.div>
        </div>
    );
}
