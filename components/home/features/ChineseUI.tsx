import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import styles from "./features.module.css";
import cn_styles from "./chinese.module.css";
import Step from "../internal/Step";
import Gradient from "../internal/Gradient";

import { BsTextCenter, BsTranslate } from "react-icons/bs";
import GardientSvg from "@static/home/purple-gradient.svg";
import { ReactNode } from "react";
import { RiMouseFill } from "react-icons/ri";
import Image from "next/image";

export function ChineseUI() {
    return (
        <div
            className={clsx(
                "w-full mt-20 min-h-[150vh] sm:min-h-[160vh] xl:min-h-[150vh] pr-8",
                cn_styles["steps-container"]
            )}
        >
            <motion.div
                className="sticky flex flex-col xl:flex-row gap-5 top-[20vh]"
                initial="hidden"
                whileInView="show"
                transition={{
                    duration: 0.5,
                    delayChildren: 0.2,
                }}
                variants={{
                    show: { y: 0, opacity: 1 },
                    hidden: {
                        y: -20,
                        opacity: 0,
                    },
                }}
            >
                <Step
                    icon={{
                        className:
                            "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-400",
                        children: <BsTranslate className="inline" />,
                    }}
                    className="relative z-[2] flex-1"
                >
                    <h1 className={`${styles.heading} mb-2`}>全中文化界面</h1>
                    <h3 className="heading-md text-secondary">
                        我們提供了全中文化的界面，讓英文不再成為優質機器人的隔閡
                    </h3>
                    <Skeleton />
                </Step>
                <Comment />
                <Gradient
                    src={GardientSvg}
                    className={clsx(
                        "absolute w-[50rem] max-w-none -z-[1]",
                        "max-xl:left-0 -max-xl:bottom-[14rem]",
                        "xl:-right-[5rem] xl:-top-[14rem]"
                    )}
                />
            </motion.div>
        </div>
    );
}

function Comment() {
    return (
        <motion.div
            className={clsx(
                "flex flex-col gap-3 mt-8 p-4 bg-white dark:bg-slate-900 rounded-xl h-fit",
                "z-[2] shadow-xl max-w-[500px]",
                "max-xl:-mt-[10rem] max-xl:ml-auto max-xl:mr-3",
                "max-sm:-ml-[1rem] max-sm:-mt-[7rem] max-lg:-mr-[1.5rem]"
            )}
            variants={{
                show: {
                    y: 0,
                    opacity: 1,
                },
                hidden: {
                    opacity: 0,
                    y: "5rem",
                },
            }}
            transition={{ duration: 0.5 }}
        >
            <div className="h-stack">
                <Image
                    alt="money"
                    src="/blog/money.jpg"
                    width="50"
                    height="50"
                    className="rounded-full aspect-square"
                />
                <div>
                    <p className="text-secondary">服務器管理員</p>
                    <h3 className="heading-md">Money</h3>
                </div>
            </div>

            <p className="text-lg flex-1 text-secondary">
                即使我不懂英語，無需繁雜的操作，我仍然可以輕鬆使用 YEE式機器龍
            </p>

            <div className="h-stack max-sm:hidden gap-5 mt-3">
                <Feature icon={<BsTextCenter />}>通俗易懂的文檔</Feature>
                <Feature icon={<RiMouseFill />}>無需繁雜的操作</Feature>
            </div>
        </motion.div>
    );
}

function Feature({ children, icon }: { children: string; icon: ReactNode }) {
    return (
        <div className="h-stack">
            <div className="text-xl sm:text-2xl bg-green-400 dark:bg-green-300 rounded-full p-1 text-black">
                {icon}
            </div>
            <p className="text-lg">{children}</p>
        </div>
    );
}

function Skeleton() {
    const foreground = "bg-slate-300 dark:bg-slate-700 rounded-full";
    const skeleton = "rounded-full bg-slate-200 dark:bg-slate-700 h-7";
    const list: Variants = {
        show: { transition: { staggerChildren: 0.1, delayChildren: 0 } },
        hidden: {},
    };
    const item: Variants = {
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
                "flex-1 aspect-[6/3] p-5 rounded-lg bg-slate-100 dark:bg-slate-900 min-w-[26rem] min-h-[15rem] max-w-[45rem] mt-8",
                "grid grid-cols-[0.5fr_1fr] gap-6",
                "shadow-xl relative"
            )}
        >
            <motion.div
                className="bg-white dark:bg-slate-800 rounded-md flex-1 p-4 flex flex-col gap-4"
                variants={list}
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
                variants={{
                    show: {
                        paddingRight: "0px",
                        opacity: 1,
                    },
                    hidden: {
                        paddingRight: "150px",
                        opacity: 0,
                    },
                }}
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
