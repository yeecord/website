import { IoMdOpen } from "react-icons/io";
import Gradient from "./internal/Gradient";
import HeroGradient from "@static/hero.svg";
import Image from "next/image";
import LinkButton from "./internal/LinkButton";
import clsx from "clsx";
import styles from "./hero.module.css";

export function Hero() {
    return (
        <div
            className={clsx(
                "w-full flex flex-col gap-12 relative z-[2] mt-[6rem] md:mt-[10rem] xl:mt-[14rem] px-[1rem]",
                "items-center text-center"
            )}
        >
            <Gradient
                src={HeroGradient}
                className="absolute hidden -top-[200px] -right-0 lg:-right-[300px] min-w-[800px] w-full -z-[1]"
            />
            <h1
                className={clsx(
                    "font-bold leading-[1.1]",
                    "text-5xl min-[360px]:text-6xl sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl"
                )}
            >
                萬中選一的
                <br className="md:hidden" />
                <span
                    className={clsx(
                        "text-gradient bg-gradient-to-r from-blue-400 via-green-300 to-blue-400",
                        styles["animated-gradient"]
                    )}
                >
                    Discord
                </span>
                <br className="md:hidden" />
                機器人
            </h1>
            <h2 className="heading-md md:text-3xl text-secondary font-medium max-w-[450px] md:max-w-[700px]">
                YEE式機器龍具有眾多功能且強大，讓你創造出優秀的中文 Discord 社群
            </h2>
            <Buttons />
            <div className="w-full flex flex-col gap-5 mt-[3rem]">
                <p className="text-lg font-semibold text-secondary mb-3">
                    各大伺服器一致好評
                </p>
                <div
                    className={clsx(
                        "overflow-hidden",
                        "max-md:mask-image-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
                    )}
                >
                    <div
                        className={clsx(
                            styles.servers,
                            "inline-block max-md:w-max"
                        )}
                    >
                        <Servers />
                        <Servers secondary />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Buttons() {
    const bn =
        "text-lg font-bold sm:text-xl rounded-md w-full px-6 py-3 sm:px-8";

    return (
        <div className="grid grid-cols-1 w-full max-w-[500px] sm:w-fit sm:grid-cols-2 gap-3">
            <LinkButton
                href="/docs"
                className={`${bn} ${styles["rainbow-border"]}`}
            >
                使用教學
            </LinkButton>
            <LinkButton
                href="/invite"
                target="_blank"
                className={`icon-button justify-center ${bn}`}
            >
                <IoMdOpen />
                邀請機器人
            </LinkButton>
        </div>
    );
}

function Servers({ secondary }: { secondary?: boolean }) {
    return (
        <div
            className={clsx(
                "inline-flex flex-row justify-center",
                "md:flex-wrap md:max-w-[60rem]",
                secondary && "md:hidden"
            )}
        >
            <Server img="/home/customers/apex-tw.png" name="APEX Taiwan" />
            <Server img="/home/customers/avery.png" name="Avery" transparent />
            <Server img="/home/customers/chengfeng.png" name="承風飛躍" />
            <Server
                img="/home/customers/daidai.png"
                name="老查呆呆の迷因調查局總部"
            />
            <Server img="/home/customers/empressival.png" name="Empressival" />
            <Server img="/home/customers/myit.png" name="MyIT" />
            <Server
                img="/home/customers/valorant-tw.png"
                name="VALORANT Taiwan"
            />
        </div>
    );
}

function Server({
    img,
    name,
    transparent,
}: {
    img: string;
    name: string;
    transparent?: boolean;
}) {
    return (
        <div className="h-stack gap-3 mx-3 my-1 text-black dark:text-white flex-shrink-0">
            <Image
                alt={name}
                src={img}
                width="45"
                height="45"
                className={clsx(
                    "rounded-full grayscale",
                    transparent && "brightness-[0%] dark:brightness-100"
                )}
            />
            <h3 className="heading-md">{name}</h3>
        </div>
    );
}
