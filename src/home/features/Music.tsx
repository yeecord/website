"use client";

import GreenGradient from "@static/home/green-gradient.svg";
import FightSong from "@static/home/songs/eve-fight-song.jpg";
import KickBack from "@static/home/songs/kick-back.jpg";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "fumadocs-core/link";
import {
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  MusicIcon,
  StopCircleIcon,
} from "lucide-react";
import Image, { type ImageProps } from "next/image";
import Gradient from "../components/Gradient";
import { Progress } from "../components/Progress";

export function Music() {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className="relative z-[2] mt-48 grid grid-cols-1 gap-4 overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary p-7 pb-0 sm:max-lg:pr-10 lg:mt-60 lg:grid-cols-[1fr_0.8fr]"
    >
      <Gradient
        src={GreenGradient}
        className={clsx(
          "-bottom-[400px] -left-[30%] -z-[1] absolute w-full min-w-[800px] opacity-60",
          "lg:-top-[50%] lg:left-[40%] lg:w-[1000px] lg:opacity-80",
        )}
      />
      <Content />
      <div className="absolute top-0 right-8 z-[2] max-sm:hidden lg:right-16">
        <div className="mx-auto h-36 w-[2px] bg-gradient-to-b from-green-400 to-cyan-600" />
        <div className="rounded-full bg-gradient-to-br from-green-400 to-cyan-600 p-4 text-white shadow-green-300/50 shadow-lg">
          <MusicIcon className="h-8 w-8" />
        </div>
      </div>
      <motion.div
        whileInView={{ y: 0 }}
        initial={{ y: 100 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "-mr-[20rem] mt-2 flex w-[650px] flex-col max-md:ml-5 max-lg:ml-8",
          "max-h-[10rem] lg:mt-[5rem] lg:max-h-full",
        )}
      >
        <div className="music-player mr-20 translate-y-[5px]">
          <MusicPlayer />
        </div>
        <div className="play-list z-[2]">
          <Playlist />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Content() {
  return (
    <div className="flex max-w-[750px] flex-col gap-3 sm:p-5 lg:max-w-none">
      <h2 className="mb-2 font-bold text-3xl sm:text-4xl">輕鬆播放音樂</h2>
      <p className="text-lg text-muted-foreground">
        讓你可以和朋友一起收聽 Spotify 和 SoundCloud
        上的音樂，並且可以自訂播放清單，讓分享好音樂變簡單
      </p>
      <div className="mt-3 flex flex-row gap-2.5">
        <Link
          className={clsx(
            "rounded-full bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-3 font-medium text-base text-white",
            "flex h-fit flex-row items-center gap-2",
          )}
          href="/docs"
        >
          了解更多 <ArrowRightCircleIcon className="inline" />
        </Link>
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
    <div className="flex flex-row gap-3 rounded-xl border bg-card p-4 text-card-foreground">
      <Image
        className="h-14 w-14 rounded-lg bg-blue-400 object-cover"
        alt={children}
        src={img}
      />
      <div className="flex flex-col gap-2">
        <p className="font-medium text-lg">{children}</p>
        <p className="text-muted-foreground text-sm">{duration}</p>
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
      <div className="mb-2 inline-flex items-center gap-2.5">
        <MusicIcon />
        <p className="font-bold">ZUTOMAYO - Study Me</p>
      </div>
      <Progress track="w-[66%]" />
      <div className="mt-2 flex flex-row gap-2.5">
        <button type="button" aria-label="prev" className={greenButton}>
          <ArrowLeftIcon />
        </button>
        <div className="w-full" />
        <button type="button" className={greenButton} aria-label="play">
          <StopCircleIcon />
        </button>
        <div className="w-full" />

        <button type="button" className={greenButton} aria-label="next">
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
