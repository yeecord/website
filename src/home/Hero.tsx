import HeroGradient from "@static/hero.svg";
import clsx from "clsx";
import Link from "fumadocs-core/link";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import Gradient from "./components/Gradient";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <div
      className={clsx(
        "relative z-[2] mt-[6rem] flex w-full flex-col gap-12 px-[1rem] md:mt-[10rem] xl:mt-[14rem]",
        "items-center text-center",
      )}
    >
      <Gradient
        src={HeroGradient}
        className="-right-0 -top-[200px] -z-[1] lg:-right-[300px] absolute hidden w-full min-w-[800px]"
      />
      <h1
        className={
          "font-bold text-5xl sm:text-7xl xl:text-8xl min-[360px]:text-6xl"
        }
      >
        萬中選一的
        <span
          className={clsx(
            "mx-1 bg-gradient-to-r from-blue-400 via-green-300 to-blue-400 bg-clip-text text-transparent max-lg:my-2 max-lg:block",
            styles["animated-gradient"],
          )}
        >
          Discord
        </span>
        機器人
      </h1>
      <p
        className={clsx(
          "max-w-[450px] text-muted-foreground text-xl",
          "md:max-w-[650px] lg:text-2xl",
        )}
      >
        YEE式機器龍功能眾多且強大，讓你簡單創造出優秀的中文 Discord 社群
      </p>
      <Buttons />
      <div className="mt=[3rem] flex w-full flex-col gap-5 md:mt-[4rem]">
        <p className="mb-3 font-semibold text-lg text-muted-foreground md:mb-4">
          各大伺服器一致好評
        </p>
        <div
          className={clsx(
            "overflow-hidden",
            "max-md:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          )}
        >
          <div
            className={clsx(
              styles.servers,
              "inline-block max-md:w-max max-md:animate-[servers-loop_infinite_30s_linear]",
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
  return (
    <div className="grid w-full max-w-[500px] grid-cols-1 gap-3 sm:w-fit sm:grid-cols-2">
      <Link
        href="/docs"
        className={cn(
          buttonVariants({ color: "ghost", size: "lg" }),
          styles["rainbow-border"],
        )}
        style={{
          boxShadow: `
          inset 2px 2px 0 var(--color-green-400),
          inset -2px -2px 0 var(--color-cyan-500),
          5px 5px 25px color-mix(in oklab, var(--color-green-400) 50%, transparent),
          -5px -5px 25px color-mix(in oklab, var(--color-cyan-500) 50%, transparent)`,
        }}
      >
        使用教學
      </Link>
      <Link
        href="https://app.yeecord.com/invite"
        target="_blank"
        className={cn(
          buttonVariants({
            color: "secondary",
            size: "lg",
          }),
        )}
      >
        <ExternalLinkIcon className="size-5" />
        邀請機器人
      </Link>
    </div>
  );
}

function Servers({ secondary }: { secondary?: boolean }) {
  return (
    <div
      className={clsx(
        "inline-flex flex-row justify-center",
        "md:max-w-[64rem] md:flex-wrap",
        secondary && "md:hidden",
      )}
    >
      <Server img="/home/customers/apex-tw.png" name="APEX Taiwan" />
      <Server img="/home/customers/valorant-tw.png" name="VALORANT Taiwan" />
      <Server img="/home/customers/avery.png" name="Avery" transparent />
      <Server img="/home/customers/zeitfrei.png" name="ZeitFrei" transparent />
      <Server
        img="/home/customers/daptor.png"
        name="有感筆電軍團 - Daptor Army"
      />
      <Server img="/home/customers/empressival.png" name="Empressival" />
      <Server
        img="/home/customers/daidai.png"
        name="老查呆呆の迷因調查局總部"
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
    <div className="mx-4 my-1 flex flex-shrink-0 flex-row items-center gap-3">
      <Image
        alt={name}
        src={img}
        width="45"
        height="45"
        className={clsx(
          "rounded-full grayscale",
          transparent && "brightness-[0%] dark:brightness-100",
        )}
      />
      <p className="text-lg sm:text-xl">{name}</p>
    </div>
  );
}
