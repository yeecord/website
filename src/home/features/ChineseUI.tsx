"use client";

import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import cn_styles from "./chinese.module.css";
import Step from "../components/Step";
import Gradient from "../components/Gradient";

import {
  AlignCenterIcon,
  LanguagesIcon,
  MousePointerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import GardientSvg from "@static/home/purple-gradient.svg";
import { type ReactNode } from "react";

export function ChineseUI() {
  return (
    <div
      className={clsx(
        "mt-20 min-h-[150vh] w-full pr-8 sm:min-h-[160vh] xl:min-h-[150vh]",
        cn_styles["steps-container"],
      )}
    >
      <motion.div
        className="sticky top-[20vh] flex flex-col gap-5"
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
            children: <LanguagesIcon className="inline sm:h-8 sm:w-8" />,
          }}
          className="relative z-[2]"
        >
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">全中文化界面</h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            我們提供了全中文化的界面，讓英文不再成為優質機器人的隔閡
          </p>
          <Skeleton />
          <div
            className={clsx(
              "relative -ml-[1rem] -mt-[14rem] w-fit sm:-mt-[15rem] xl:-mt-[25rem] xl:ml-auto xl:mr-[14%]",
            )}
          >
            <Feature icon={<ShieldCheckIcon />}>豐富的社群管理功能</Feature>
            <Feature icon={<AlignCenterIcon />}>通俗易懂的文檔</Feature>
            <Feature icon={<MousePointerIcon />}>無需繁雜的操作</Feature>
          </div>
        </Step>
        <Gradient
          src={GardientSvg}
          className={clsx(
            "absolute -z-[1] w-[50rem] max-w-none",
            "-max-xl:bottom-[14rem] max-xl:left-0",
            "xl:-right-[5rem] xl:-top-[14rem]",
          )}
        />
      </motion.div>
    </div>
  );
}

function Feature({ children, icon }: { children: string; icon: ReactNode }) {
  return (
    <motion.div
      className="mt-4 flex flex-row items-center gap-3 rounded-xl bg-secondary p-4 text-secondary-foreground shadow-2xl shadow-blue-800/30 dark:shadow-black/60 xl:pr-[4rem]"
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
      <div className="rounded-full bg-purple-500 p-2 text-xl text-white dark:bg-purple-500 sm:text-2xl">
        {icon}
      </div>
      <p className="text-lg font-medium">{children}</p>
    </motion.div>
  );
}

function Skeleton() {
  const foreground = "bg-muted-foreground/20 rounded-full";
  const skeleton = "rounded-full bg-muted-foreground/20 h-7";
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
    <div className="relative mt-8 grid aspect-[6/3] min-h-[17rem] min-w-[26rem] max-w-[45rem] flex-1 grid-cols-[0.5fr_1fr] gap-6 rounded-lg bg-card p-5 shadow-xl">
      <motion.div
        className="flex flex-1 flex-col gap-4 rounded-md bg-secondary p-4"
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
        className="flex flex-col gap-4 text-xl"
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
        <h2 className="text-lg font-bold sm:text-xl">指令區</h2>
        <div className={`${foreground} h-7`} />
        <div className={`${foreground} h-6 w-[70%]`} />
      </motion.div>
    </div>
  );
}
