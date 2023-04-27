import Gradient from "./components/Gradient";
import LinkButton from "./components/LinkButton";
import CyanPinkGradient from "@static/home/cyan-pink-gradient.svg";
import GradientRing from "@static/home/gradient-ring.svg";
import Image from "next/image";
import clsx from "clsx";
import formatter from "@utils/formatter";
import { FaDiscord } from "react-icons/fa";
import styles from "./community.module.css";
import { BsTwitter } from "react-icons/bs";

export function Community({ joined }: { joined: number }) {
  return (
    <div className="relative z-[2] mt-[2rem] flex w-full flex-col items-center gap-5 overflow-hidden py-[3rem] px-3 text-center md:px-6">
      <Gradient
        src={CyanPinkGradient}
        className="absolute top-0 left-0 -z-[1] h-full w-full overflow-visible object-cover opacity-20"
      />
      <h1 className="text-5xl font-bold text-pink-400 xl:text-6xl">
        <span>與</span>
        <span className="mx-2 text-cyan-300 [text-shadow:_#e66ad0_3px_5px]">
          我們
        </span>
        <span>聯繫</span>
      </h1>
      <h3 className="text-lg font-bold text-black  dark:text-slate-200 sm:text-xl">
        獲取我們的最新消息
      </h3>

      <JoinButton joined={joined} />
    </div>
  );
}

function JoinButton({ joined }: { joined: number }) {
  return (
    <div className="relative z-[2] p-[6rem]">
      <Image
        alt=""
        src={GradientRing}
        className={clsx(
          "pointer-events-none absolute top-0 left-0 -z-[1] h-full w-full select-none object-contain",
          styles["rotate-z"],
        )}
      />
      <div className="flex flex-row gap-4">
        <LinkButton
          href="https://twitter.com/yeecord"
          className="h-full rounded-full bg-blue-500 p-4 text-white shadow-xl shadow-blue-300 dark:shadow-blue-800"
          target="_blank"
        >
          <BsTwitter className="text-4xl" />
        </LinkButton>
        <LinkButton
          href="https://discord.gg/yeecord"
          target="_blank"
          className={clsx(
            "inline-flex h-full items-center gap-2.5 rounded-full bg-gradient-to-br from-pink-400 to-cyan-400 p-3 font-bold",
            "text-3xl text-white shadow-xl shadow-cyan-400/50",
          )}
          aria-label="Join"
        >
          <FaDiscord className="text-5xl" />
          <span className="mr-2">{formatter.format(joined)}</span>
        </LinkButton>
      </div>
    </div>
  );
}
