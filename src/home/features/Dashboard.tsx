"use client";

import ChartSvg from "@static/home/chart.svg";
import clsx from "clsx";
import { motion } from "framer-motion";
import { BarChartIcon, MusicIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "../components/Progress";

const card = clsx(
  "text-secondary-foreground bg-gradient-to-b from-secondary border rounded-2xl border p-5 shadow-xl flex flex-col",
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
        <h2 className="font-bold text-3xl sm:text-5xl">簡易的控制面板</h2>
        <p className="text-lg text-muted-foreground sm:text-xl">
          通過美觀、簡易的方式來自定義
          <br className="sm:hidden" />
          你的機器人
        </p>
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white">
          <SettingsIcon />
        </div>
        <div>
          <p className="font-bold text-lg sm:text-xl">設置</p>
          <p className="text-muted-foreground">下拉選單身分組</p>
        </div>
      </div>
      <Link
        href="/docs/commands/role"
        className="mt-auto rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 px-6 py-3 text-center font-medium text-sm text-white"
      >
        + 添加身分組
      </Link>
    </motion.div>
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <BarChartIcon />
        </div>
        <div>
          <p className="font-bold text-lg sm:text-xl">你的伺服器</p>
          <p className="text-muted-foreground">數據分析</p>
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
          <MusicIcon />
        </div>
        <div>
          <p className="font-bold text-lg sm:text-xl">音樂系統</p>
          <p className="text-muted-foreground">下一首歌</p>
        </div>
      </div>
      <div className="mt-auto flex flex-row items-center gap-2.5 pt-2">
        <p>1:02</p>
        <Progress track="w-[36%]" />
        <p>3:20</p>
      </div>
    </motion.div>
  );
}
