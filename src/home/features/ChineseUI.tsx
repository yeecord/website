"use client";

import GardientSvg from "@static/home/purple-gradient.svg";
import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import {
  AlignCenterIcon,
  LanguagesIcon,
  MousePointerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Gradient from "../components/Gradient";
import Step from "../components/Step";

export function ChineseUI() {
  return (
    <div
      className="z-[2] ml-[1.3rem] min-h-[150vh] w-full border-l pt-[10rem] pr-8 pb-10 pl-1 sm:ml-1 sm:min-h-[140vh] sm:pl-[2.5rem]"
      style={{
        borderImage: `linear-gradient(
      to bottom,
      theme("colors.purple.400") 60%,
      theme("colors.orange.400")
    )
    1 100%`,
      }}
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
          <h2 className="mb-2 font-bold text-2xl sm:text-3xl">全中文化界面</h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            我們提供了全中文化的界面，讓英文不再成為優質機器人的隔閡
          </p>
          <Skeleton />
          <div
            className={clsx(
              "-ml-[1rem] -mt-[14rem] sm:-mt-[15rem] xl:-mt-[25rem] relative w-fit xl:mr-[14%] xl:ml-auto",
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
            "-z-[1] absolute w-[50rem] max-w-none",
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
      className="mt-4 flex flex-row items-center gap-3 rounded-xl bg-secondary p-4 text-secondary-foreground shadow-2xl shadow-blue-800/30 xl:pr-[4rem] dark:shadow-black/60"
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
      <div className="rounded-full bg-purple-500 p-2 text-white text-xl sm:text-2xl dark:bg-purple-500">
        {icon}
      </div>
      <p className="font-medium text-lg">{children}</p>
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
        <p className="font-bold text-lg sm:text-xl">指令區</p>
        <div className={`${foreground} h-7`} />
        <div className={`${foreground} h-6 w-[70%]`} />
      </motion.div>
    </div>
  );
}
