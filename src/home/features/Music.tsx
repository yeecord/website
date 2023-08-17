"use client";

import Image, { type ImageProps } from "next/image";
import { AiFillCaretRight } from "react-icons/ai";
import {
  BsMusicNoteBeamed,
  BsArrowLeft,
  BsArrowRight,
  BsArrowRightCircleFill,
} from "react-icons/bs";
import { Progress } from "../components/Progress";
import KickBack from "@static/home/songs/kick-back.jpg";
import FightSong from "@static/home/songs/eve-fight-song.jpg";
import GreenGradient from "@static/home/green-gradient.svg";
import { motion } from "framer-motion";
import Gradient from "../components/Gradient";
import clsx from "clsx";
import styles from "./music.module.css";
import LinkButton from "../components/LinkButton";

export function Music() {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "relative z-[2] mt-[12rem] grid grid-cols-1 gap-4 p-7 pb-0 sm:max-lg:pr-10 lg:mt-[15rem]",
        "lg:grid-cols-[1fr_0.8fr]",
        "overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900",
      )}
    >
      <Gradient
        src={GreenGradient}
        className={clsx(
          "absolute -bottom-[400px] -left-[30%] -z-[1] w-full min-w-[800px] opacity-60",
          "lg:-top-[50%] lg:left-[40%] lg:w-[1000px] lg:opacity-80",
        )}
      />
      <Content />
      <div className="absolute right-8 top-0 z-[2] max-sm:hidden lg:right-16">
        <div className="mx-auto h-36 w-[2px] bg-gradient-to-b from-green-400 to-cyan-600" />
        <div
          className={clsx(
            "rounded-full bg-gradient-to-br from-green-400 to-cyan-600 p-4",
            "text-2xl text-white shadow-lg shadow-green-300/50",
            "lg:text-3xl",
          )}
        >
          <BsMusicNoteBeamed />
        </div>
      </div>
      <motion.div
        whileInView={{ y: 0 }}
        initial={{ y: 100 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "-mr-[20rem] mt-2 flex w-[650px] flex-col max-lg:ml-8 max-md:ml-5",
          "max-h-[10rem] lg:mt-[5rem] lg:max-h-full",
        )}
      >
        <div className={`${styles["music-player"]} mr-20`}>
          <MusicPlayer />
        </div>
        <div className={`z-[2] ${styles["play-list"]}`}>
          <Playlist />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Content() {
  return (
    <div
      className={clsx(
        "flex max-w-[750px] flex-col gap-3 lg:max-w-none",
        "sm:p-5 md:p-5",
      )}
    >
      <h1 className="text-3xl font-bold sm:text-5xl">輕鬆播放音樂</h1>
      <h3 className="text-lg font-bold text-muted-foreground sm:text-xl">
        讓你可以和朋友一起收聽 Spotify 和 SoundCloud
        上的音樂，並且可以自訂播放清單，讓分享好音樂變簡單
      </h3>
      <div className="mt-3 flex flex-row gap-2.5">
        <LinkButton
          className={clsx(
            "rounded-full bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-3 text-lg font-bold text-white",
            "flex h-fit flex-row items-center gap-2",
          )}
          href="/docs"
        >
          了解更多 <BsArrowRightCircleFill className="inline" />
        </LinkButton>
      </div>
    </div>
  );
}

function Playlist() {
  return (
    <div className="-mt-[60px] ml-[150px] flex flex-col gap-5">
      <Song img={FightSong} duration="4:18">
        Eve - Fight Song
      </Song>
      <Song img={KickBack} duration="4:18">
        米津玄師 - Kick Back
      </Song>
    </div>
  );
}

function Song({
  img,
  duration,
  children,
}: {
  img: ImageProps["src"];
  duration: string;
  children: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md backdrop-blur-md dark:bg-black/70">
      <div className="flex flex-row gap-2">
        <Image
          className="h-16 w-16 rounded-lg bg-blue-400 object-cover"
          alt={children}
          src={img}
        />
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold sm:text-xl">{children}</h3>
          <p className="text-lg text-muted-foreground">{duration}</p>
        </div>
      </div>
    </div>
  );
}

function MusicPlayer() {
  const greenButton = clsx(
    "rounded-full text-lg font-bold text-white p-3 bg-gradient-to-r from-green-400 to-cyan-500",
    "dark:to-cyan-500 dark:from-green-600",
  );

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3 rounded-2xl bg-white p-5 dark:bg-zinc-900">
      <div className="mb-2 flex flex-row gap-2.5">
        <BsMusicNoteBeamed />
        <p className="font-bold">ZUTOMAYO - Study Me</p>
      </div>
      <Progress track="w-[66%]" />
      <div className="mt-2 flex flex-row gap-2.5">
        <button aria-label="prev" className={greenButton}>
          <BsArrowLeft />
        </button>
        <div className="w-full" />
        <button className={greenButton} aria-label="play">
          <AiFillCaretRight />
        </button>
        <div className="w-full" />

        <button className={greenButton} aria-label="next">
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
}
