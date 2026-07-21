import clsx from "clsx";
import Link from "fumadocs-core/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export function Hero() {
  return (
    <div className="relative z-[2] mt-16 flex w-full flex-col gap-16 px-4 md:mt-24">
      <div className="flex items-center justify-between gap-8">
        <div className="flex flex-col gap-7 text-center md:text-start">
          <h1 className="font-bold text-5xl leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
            一隻恐龍
            <br />
            搞定整個<span className="text-primary">伺服器</span>
          </h1>
          <p className="mx-auto max-w-[34rem] text-lg text-muted-foreground sm:text-xl md:mx-0">
            YEE 式機器龍是全中文的 Discord
            機器人：抽獎、身分組、動態語音、找吃的小遊戲通通都有，25
            萬個伺服器都在用。
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              href="/invite/"
              className={cn(buttonVariants({ color: "primary", size: "lg" }))}
            >
              免費安裝機器人
            </Link>
            <Link
              href="/zh-tw/docs"
              className={cn(buttonVariants({ color: "secondary", size: "lg" }))}
            >
              看使用教學
            </Link>
          </div>
        </div>
        <img
          alt="YEE 式機器龍"
          src="/img/logo.svg"
          className="h-56 animate-[updown_5s_infinite] drop-shadow-xl max-md:hidden lg:h-72"
        />
      </div>
      <ServerMarquee />
    </div>
  );
}

function ServerMarquee() {
  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-center font-semibold text-lg text-muted-foreground">
        各大伺服器一致好評
      </p>
      <div
        className={clsx(
          "overflow-hidden",
          "max-md:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        )}
      >
        <div className="inline-block max-md:w-max max-md:animate-[servers-loop_infinite_30s_linear]">
          <Servers />
          <Servers secondary />
        </div>
      </div>
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
      <img
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
