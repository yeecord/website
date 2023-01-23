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
        <div className="flex flex-col w-full gap-5 items-center text-center mt-[2rem] py-[3rem] px-3 md:px-6 z-[2] relative overflow-hidden">
            <Gradient
                src={CyanPinkGradient}
                className="absolute -z-[1] top-0 left-0 w-full overflow-visible object-cover h-full opacity-20"
            />
            <h1 className="heading-xl xl:text-6xl">
                <span className="text-cyan-400 [text-shadow:_#e66ad0_3px_5px] mr-2">
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
        <div className="p-[6rem] z-[2] relative">
            <Image
                alt=""
                src={GradientRing}
                className={clsx(
                    "absolute top-0 left-0 object-contain select-none pointer-events-none w-full h-full -z-[1]",
                    styles["rotate-z"]
                )}
            />
            <LinkButton
                href="https://discord.gg/yeecord"
                target="_blank"
                className={clsx(
                    "icon-button p-3 w-fit h-fit rounded-full bg-gradient-to-br from-pink-400 to-cyan-400",
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
