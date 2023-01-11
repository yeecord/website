import clsx from "clsx";
import { motion } from "framer-motion";
import { Step } from "./Step";
import global from "./features.module.css";
import styles from "./rpg.module.css";
import { RiGameFill } from "react-icons/ri";
import Image from "next/image";
import DinoSvg from "@static/home/dino.svg";
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
                        "rounded-2xl dark:bg-slate-900 gap-5",
                        "flex flex-col-reverse md:flex-row md:p-8 md:bg-slate-100"
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

                    <Image
                        src={DinoSvg}
                        alt="dino"
                        className="bg-purple-400 p-5 rounded-2xl"
                    />
                </Step>
            </motion.div>
        </div>
    );
}
