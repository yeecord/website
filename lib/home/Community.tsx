import Gradient from "./components/Gradient";
import LinkButton from "./components/LinkButton";
import CyanPinkGradient from "@static/home/cyan-pink-gradient.svg";
import GradientRing from "@static/home/gradient-ring.svg";
import Image from "next/image";
import clsx from "clsx";
import formatter from "@utils/formatter";
import { FaDiscord } from "react-icons/fa";
import styles from "./community.module.css";

export function Community({ joined }: { joined: number }) {
  return (
    <div className="relative z-[2] mt-[2rem] flex w-full flex-col items-center gap-5 overflow-hidden py-[3rem] px-3 text-center md:px-6">
      <Gradient
        src={CyanPinkGradient}
        className="absolute top-0 left-0 -z-[1] h-full w-full overflow-visible object-cover opacity-20"
      />
      <h1 className="heading-xl xl:text-6xl">
        <span className="mr-2 text-cyan-400 [text-shadow:_#e66ad0_3px_5px]">
          Discord
        </span>
        <span className="text-pink-400">社群</span>
      </h1>
      <h3 className="heading-md  text-black dark:text-slate-200">
        我們歡迎大家！
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
          styles["rotate-z"]
        )}
      />
      <LinkButton
        href="https://discord.gg/yeecord"
        target="_blank"
        className={clsx(
          "icon-button h-fit w-fit rounded-full bg-gradient-to-br from-pink-400 to-cyan-400 p-3",
          "text-3xl text-white shadow-xl shadow-cyan-400/50"
        )}
        aria-label="Join"
      >
        <FaDiscord className="text-5xl" />
        {formatter.format(joined)}
      </LinkButton>
    </div>
  );
}
