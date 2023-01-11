import clsx from "clsx";
import styles from "./features.module.css";
import ChartSvg from "@static/home/chart.svg";
import Image from "next/image";
import {
    BsBarChartFill,
    BsEmojiAngryFill,
    BsMusicNoteBeamed,
} from "react-icons/bs";
import { RiSettings2Fill } from "react-icons/ri";
import lstyles from "./dashboard.module.css";
import { Progress } from "../Progress";

export function Dashboard() {
    return (
        <div className="mt-[5rem] z-[2]">
            <div className="flex flex-col gap-5 text-center items-center">
                <div
                    className={clsx(
                        "w-1 h-[9rem] bg-gradient-to-b",
                        "from-transparent via-purple-400 to-purple-600 dark:to-purple-100"
                    )}
                />
                <h1 className={styles.heading}>簡易的控制面板</h1>
                <h3 className="heading-md text-secondary">
                    通過美觀、簡易的方式來自定義
                    <br className="sm:hidden" />
                    你的機器人
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-[2rem]">
                <Chart />
                <Settings />

                <div className={lstyles.card}>
                    <div className="h-stack">
                        <div className="p-3 rounded-xl text-white bg-green-500 text-3xl">
                            <BsMusicNoteBeamed />
                        </div>
                        <div>
                            <h3 className="heading-md">音樂系統</h3>
                            <p className="text-secondary">下一首歌</p>
                        </div>
                    </div>
                    <div className="h-stack mt-auto pt-2">
                        <p>1:02</p>
                        <Progress track="w-[36%]" />
                        <p>3:20</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Settings() {
    return (
        <div className={`${lstyles.card} gap-3`}>
            <div className="h-stack">
                <div className="p-3 rounded-xl text-white bg-purple-500 text-3xl">
                    <RiSettings2Fill />
                </div>
                <div>
                    <h3 className="heading-md">設置</h3>
                    <p className="text-secondary">下拉選單身分組</p>
                </div>
            </div>
            <div
                className={clsx(
                    "grid-cols-3 h-full gap-4 flex-1",
                    "hidden sm:grid"
                )}
            >
                <RoleItem />
                <RoleItem />
                <RoleItem />
            </div>
            <button className="mt-auto rounded-xl from-purple-400 to-purple-600 primary-button">
                + 添加身分組
            </button>
        </div>
    );
}

function RoleItem() {
    return (
        <div className="rounded-xl bg-purple-200 text-white flex items-center justify-center p-3">
            <BsEmojiAngryFill className="text-3xl" />
        </div>
    );
}

function Chart() {
    return (
        <div className={clsx("row-span-2", lstyles.card)}>
            <div className="h-stack">
                <div className="p-5 rounded-xl text-white bg-blue-600 text-3xl">
                    <BsBarChartFill />
                </div>
                <div>
                    <h3 className="heading-md">你的伺服器</h3>
                    <p className="text-secondary">數據分析</p>
                </div>
            </div>
            <Image src={ChartSvg} alt="chart" className="rounded-3xl mt-auto" />
        </div>
    );
}
