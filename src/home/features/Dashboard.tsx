"use client";

import clsx from "clsx";
import ChartSvg from "@static/home/chart.svg";
import Image from "next/image";
import {
  BsBarChartFill,
  BsEmojiAngryFill,
  BsMusicNoteBeamed,
} from "react-icons/bs";
import { RiSettings2Fill } from "react-icons/ri";
import { Progress } from "../components/Progress";
import { motion } from "framer-motion";

const card = clsx(
  "bg-slate-100 rounded-3xl p-5 shadow-xl flex flex-col",
  "dark:bg-slate-900",
);

export function Dashboard() {
  return (
    <div className="z-[2] mt-[5rem]">
      <div className="flex flex-col items-center gap-5 text-center">
        <div
          className={clsx(
            "h-[9rem] w-1 bg-gradient-to-b",
            "from-transparent via-purple-400 to-purple-600 dark:to-purple-100",
          )}
        />
        <h1 className="text-3xl font-bold sm:text-5xl">簡易的控制面板</h1>
        <h3 className="text-lg text-muted-foreground sm:text-xl">
          通過美觀、簡易的方式來自定義
          <br className="sm:hidden" />
          你的機器人
        </h3>
      </div>
      <div className="mt-[2rem] grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Chart />
        <Settings />
        <Music />
      </div>
    </div>
  );
}

function Settings() {
  return (
    <motion.div
      className={`${card} gap-3`}
      whileInView={{ y: 0 }}
      initial={{ y: "10rem" }}
    >
      <div className="flex flex-row gap-2.5">
        <div className="rounded-xl bg-purple-500 p-3 text-3xl text-white">
          <RiSettings2Fill />
        </div>
        <div>
          <h3 className="text-lg font-bold sm:text-xl">設置</h3>
          <p className="font-bold text-muted-foreground">下拉選單身分組</p>
        </div>
      </div>
      <div
        className={clsx("h-full flex-1 grid-cols-3 gap-4", "hidden lg:grid")}
      >
        <RoleItem />
        <RoleItem />
        <RoleItem />
      </div>
      <button className="mt-auto rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 px-6 py-3 text-lg font-bold text-white">
        + 添加身分組
      </button>
    </motion.div>
  );
}

function RoleItem() {
  return (
    <div className="flex items-center justify-center rounded-xl bg-purple-200 p-3 text-white dark:bg-purple-500/50">
      <BsEmojiAngryFill className="text-3xl" />
    </div>
  );
}

function Chart() {
  return (
    <motion.div
      className={clsx("row-span-2", card)}
      whileInView={{ x: 0, opacity: 1 }}
      initial={{ x: "8rem", opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-row gap-2.5">
        <div className="rounded-xl bg-blue-600 p-5 text-3xl text-white">
          <BsBarChartFill />
        </div>
        <div>
          <h3 className="text-lg font-bold sm:text-xl">你的伺服器</h3>
          <p className="font-bold text-muted-foreground">數據分析</p>
        </div>
      </div>
      <Image src={ChartSvg} alt="chart" className="mt-auto rounded-3xl" />
    </motion.div>
  );
}

function Music() {
  return (
    <motion.div
      className={`${card} gap-3`}
      whileInView={{ y: 0 }}
      initial={{ y: "10rem" }}
    >
      <div className="flex flex-row gap-2.5">
        <div className="rounded-xl bg-green-500 p-3 text-3xl text-white">
          <BsMusicNoteBeamed />
        </div>
        <div>
          <h3 className="text-lg font-bold sm:text-xl">音樂系統</h3>
          <p className="font-bold text-muted-foreground">下一首歌</p>
        </div>
      </div>
      <div className="mt-auto flex flex-row gap-2.5 pt-2">
        <p>1:02</p>
        <Progress track="w-[36%]" />
        <p>3:20</p>
      </div>
    </motion.div>
  );
}
