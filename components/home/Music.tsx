import Image, { ImageProps } from "next/image";
import { AiFillCaretRight } from "react-icons/ai";
import { BsMusicNoteBeamed, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Progress } from "./Progress";
import KickBack from "@static/home/songs/kick-back.jpg";
import FightSong from "@static/home/songs/eve-fight-song.jpg";
import GreenGradient from "@static/home/green-gradient.svg";
import { motion } from "framer-motion";
import { Gradient } from "@components/Gradient";
import clsx from "clsx";
import { LinkButton } from "@components/LinkButton";

export function Music() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-4 lg:gap-10 relative z-[2] mt-[8rem] lg:mt-[6rem]">
      <Gradient
        src={GreenGradient}
        className={clsx(
          "absolute -bottom-[300px] -left-[30%] min-w-[800px] w-full opacity-60 -z-[1]",
          "lg:-top-[60%] lg:opacity-80 lg:w-[1000px] lg:left-[30%]"
        )}
      />
      <Content />
      <div className="hidden flex-col lg:mt-[5rem] sm:flex w-full max-w-[650px]">
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="mr-20"
        >
          <MusicPlayer />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="z-[2]"
        >
          <Playlist />
        </motion.div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col gap-3 justify-center max-w-[750px] lg:max-w-none">
      <h1 className="heading-xl leading-[1.2]">
        <span className="text-gradient text-4xl from-green-400 to-cyan-400">
          只要一個指令
        </span>
        <br /> 輕鬆在
        <span className="text-gradient from-green-300 to-cyan-400">
          Discord
        </span>
        播放音樂
      </h1>
      <h3 className="heading-md text-secondary">
        讓你可以和朋友一起收聽 YouTube 和 Spotify 上的音樂，並且可以自訂播放清單，讓分享好音樂變簡單
      </h3>
      <div className="h-stack mt-2">
        <LinkButton
          className="primary-button bg-gradient-to-r from-cyan-500 to-green-500"
          href="/docs"
        >
          了解更多
        </LinkButton>
      </div>
    </div>
  );
}

function Playlist() {
  return (
    <div className="flex flex-col gap-5 ml-[150px] -mt-[60px]">
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
    <div
      className={clsx(
        "rounded-xl shadow-md p-4 backdrop-blur-lg",
        "bg-gradient-to-br from-white dark:from-black to-green-200 dark:to-green-800"
      )}
    >
      <div className="flex flex-row gap-2">
        <Image
          className="bg-blue-400 rounded-lg w-16 h-16 object-cover"
          alt="Song"
          src={img}
        />
        <div className="flex flex-col gap-3">
          <h3 className="heading-md">{children}</h3>
          <p className="text-lg text-secondary-light dark:text-secondary-dark">
            {duration}
          </p>
        </div>
      </div>
    </div>
  );
}

function MusicPlayer() {
  const greenButton = clsx(
    "primary-button p-3 bg-gradient-to-r from-green-400 to-cyan-500",
    "dark:to-cyan-500 dark:from-green-600"
  );

  return (
    <div className="card max-w-[400px] w-full flex flex-col gap-3">
      <div className="h-stack mb-2">
        <BsMusicNoteBeamed />
        <p className="font-bold">ZUTOMAYO - Study Me</p>
      </div>
      <Progress track="w-[66%]" />
      <div className="h-stack mt-2">
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
