import clsx from "clsx";
import Link from "fumadocs-core/link";
import { DinoMascot } from "./DinoMascot";

export function Hero() {
  return (
    <div className="relative z-[2] w-full">
      <div className="relative flex flex-col items-center gap-7 px-4 pt-20 pb-64 text-center md:pt-28">
        <Sky />
        <h1 className="font-bold text-5xl leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
          一隻恐龍
          <br />
          搞定整個<span className="text-primary">伺服器</span>
        </h1>
        <p className="max-w-[34rem] text-lg text-muted-foreground sm:text-xl">
          YEE 式機器龍是全中文的 Discord
          機器人：抽獎、身分組、動態語音、找吃的小遊戲通通都有，25
          萬個伺服器都在用。
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/invite/" className="btn-chunky">
            免費安裝機器人
          </Link>
          <Link href="/zh-tw/docs" className="btn-chunky-secondary">
            看使用教學
          </Link>
        </div>
        <Hills />
        <DinoMascot className="absolute bottom-10 right-[8%] sm:right-[12%]" />
      </div>
      <div className="bg-hill-front pt-2 pb-10">
        <ServerMarquee />
      </div>
    </div>
  );
}

function Sky() {
  const firefly =
    "absolute size-1.5 rounded-full bg-primary/60 animate-pulse motion-reduce:animate-none";

  return (
    <div className="-z-[1] absolute inset-0 overflow-hidden">
      <span className={clsx(firefly, "top-[18%] left-[12%]")} />
      <span
        className={clsx(firefly, "top-[34%] left-[22%] [animation-delay:.6s]")}
      />
      <span
        className={clsx(firefly, "top-[22%] right-[18%] [animation-delay:.3s]")}
      />
      <span
        className={clsx(firefly, "top-[45%] right-[9%] [animation-delay:.9s]")}
      />
      <span
        className={clsx(firefly, "top-[60%] left-[7%] [animation-delay:1.2s]")}
      />
    </div>
  );
}

function Hills() {
  return (
    <div className="-z-[1] absolute inset-x-0 bottom-0 overflow-hidden">
      <div className="-mb-14 sm:-mb-20 relative h-56">
        <div className="-left-[20%] absolute bottom-0 h-52 w-[75%] rounded-[50%] bg-hill-back" />
        <div className="-right-[25%] absolute bottom-[-2rem] h-56 w-[85%] rounded-[50%] bg-hill-mid" />
        <div className="-inset-x-[10%] absolute bottom-[-5rem] h-44 rounded-[50%] bg-hill-front" />
      </div>
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
        "md:w-full md:flex-wrap",
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
