import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import cn_styles from "./chinese.module.css";
import Step from "../components/Step";
import Gradient from "../components/Gradient";

import { BsShieldFillCheck, BsTextCenter, BsTranslate } from "react-icons/bs";
import GardientSvg from "@static/home/purple-gradient.svg";
import { ReactNode } from "react";
import { RiMouseFill } from "react-icons/ri";

export function ChineseUI() {
    return (
        <div
            className={clsx(
                "w-full mt-20 min-h-[150vh] sm:min-h-[160vh] xl:min-h-[150vh] pr-8",
                cn_styles["steps-container"]
            )}
        >
            <motion.div
                className="sticky flex flex-col gap-5 top-[20vh]"
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
                    className="relative z-[2]"
                >
                    <h1 className="features-heading mb-2">全中文化界面</h1>
                    <h3 className="heading-md text-secondary">
                        我們提供了全中文化的界面，讓英文不再成為優質機器人的隔閡
                    </h3>
                    <Skeleton />
                    <div
                        className={clsx(
                            "-ml-[1rem] -mt-[14rem] sm:-mt-[15rem] xl:-mt-[25rem] xl:mr-[14%] xl:ml-auto w-fit"
                        )}
                    >
                        <Feature icon={<BsShieldFillCheck />}>
                            豐富的社群管理功能
                        </Feature>
                        <Feature icon={<BsTextCenter />}>
                            通俗易懂的文檔
                        </Feature>
                        <Feature icon={<RiMouseFill />}>無需繁雜的操作</Feature>
                    </div>
                </Step>
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

function Feature({ children, icon }: { children: string; icon: ReactNode }) {
    return (
        <motion.div
            className={clsx(
                "h-stack mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl h-fit xl:pr-[4rem]",
                "shadow-2xl shadow-blue-800/30 dark:shadow-black/60"
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
            <div className="text-xl sm:text-2xl bg-purple-400 dark:bg-purple-500 rounded-full p-2 text-white">
                {icon}
            </div>
            <p className="text-lg font-bold">{children}</p>
        </motion.div>
    );
}

function Skeleton() {
    const foreground = "bg-slate-300 dark:bg-slate-800 rounded-full";
    const skeleton = "rounded-full bg-slate-200 dark:bg-slate-800 h-7";
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
                "flex-1 aspect-[6/3] p-5 rounded-lg bg-slate-100 dark:bg-slate-900/70 min-w-[26rem] min-h-[17rem] max-w-[45rem] mt-8",
                "grid grid-cols-[0.5fr_1fr] gap-6",
                "shadow-xl relative"
            )}
        >
            <motion.div
                className="bg-white dark:bg-slate-900/50 rounded-md flex-1 p-4 flex flex-col gap-4"
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
            </motion.div>
        </div>
    );
}
