import { motion } from "framer-motion";
import { RiDiscordFill } from "react-icons/ri";
import Gradient from "./components/Gradient";
import LinkButton from "./components/LinkButton";
import CyanPinkGradient from "@static/home/cyan-pink-gradient.svg";
import GradientRing from "@static/home/gradient-ring.svg";
import Image from "next/image";
import clsx from "clsx";
import { Tooltip, TooltipProvider, TooltipWrapper } from "react-tooltip";
import formatter from "../../lib/utils/formatter";

const MotionImage = motion(Image);

export function Community({ joined }: { joined: number }) {
    return (
        <div className="flex flex-col w-full gap-5 items-center text-center mt-[5rem] py-[5rem] px-3 md:px-6 z-[2] relative">
            <Gradient
                src={CyanPinkGradient}
                className="absolute -z-[1] top-0 left-0 w-full overflow-visible object-cover h-full opacity-20"
            />
            <h1 className="heading-xl xl:text-6xl">
                <span className="text-gradient from-cyan-400 to-pink-400 dark:from-pink-300 dark:to-cyan-300 mr-2">
                    Discord
                </span>
                社群
            </h1>
            <h3 className="heading-md text-secondary text-medium">
                參與我們的社群。我們歡迎大家！
            </h3>

            <JoinButton />
            <div className="h-stack flex-wrap justify-center">
                <h2
                    className="font-bold text-6xl md:text-5xl bg-gradient-to-br text-gradient from-cyan-300 to-pink-300"
                    style={{
                        textShadow: "#22d3ee 2px 5px",
                    }}
                >
                    {formatter.format(joined)}
                </h2>
                <h3
                    className="text-2xl font-bold text-pink-400 dark:text-pink-300"
                    style={{ textShadow: "#67e8f9 1px 1px" }}
                >
                    位成員已加入
                </h3>
            </div>
        </div>
    );
}

function JoinButton() {
    return (
        <div className="p-[6rem] z-[2] relative">
            <MotionImage
                alt=""
                src={GradientRing}
                animate={{
                    rotateZ: [0, 360],
                }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 0,
                    duration: 4,
                    ease: "linear",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                }}
            />
            <TooltipProvider>
                <Tooltip />
                <TooltipWrapper content="加入我們!" place="top" offset={40}>
                    <LinkButton
                        href="https://discord.com/invite/yeecord"
                        target="_blank"
                        className={clsx(
                            "icon-button p-3 w-fit h-fit rounded-full bg-gradient-to-br from-pink-500 to-purple-400",
                            "text-5xl text-white shadow-xl shadow-pink-400/50"
                        )}
                        aria-label="Join"
                    >
                        <RiDiscordFill />
                    </LinkButton>
                </TooltipWrapper>
            </TooltipProvider>
        </div>
    );
}