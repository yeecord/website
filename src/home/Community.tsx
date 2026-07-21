import Link from "fumadocs-core/link";
import { Cloud, GroundBand, Plant } from "./scene";

export function Community() {
  return (
    <div className="relative z-[2] mt-40">
      <div className="relative flex flex-col items-center gap-6 px-4 pt-16 text-center">
        <Cloud n={2} width={140} className="top-[6%] left-[14%]" />
        <Cloud
          n={3}
          width={180}
          className="top-[22%] right-[9%] opacity-80 [animation-delay:-8s]"
        />
        <div className="relative">
          <span className="-right-6 -top-2 absolute animate-pulse font-bold text-muted-foreground/70 text-xl">
            z
          </span>
          <span className="-right-11 -top-7 absolute animate-pulse font-bold text-lg text-muted-foreground/50 [animation-delay:.4s]">
            z
          </span>
          <img
            alt=""
            src="/img/logo.svg"
            className="h-24 rotate-6 animate-[bob_7s_ease-in-out_infinite] motion-reduce:animate-none"
            draggable={false}
          />
        </div>
        <h2 className="font-bold text-4xl tracking-tight sm:text-5xl">
          把機器龍帶回家
        </h2>
        <p className="max-w-[32rem] text-lg text-muted-foreground">
          安裝免費，設定五分鐘。卡關了就來 Discord 社群喊一聲，我們都在。
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-3 pb-10">
          <Link href="/invite/" className="btn-chunky">
            免費安裝機器人
          </Link>
          <Link
            href="https://discord.gg/yeecord"
            target="_blank"
            className="btn-chunky-secondary"
          >
            加入 Discord 社群
          </Link>
        </div>
      </div>
      <GroundBand className="h-28">
        <Plant src="treeSmall_green1" height={48} className="top-6 left-[12%]" />
        <Plant
          src="bush2"
          height={38}
          className="top-9 right-[15%] [animation-delay:-2.4s]"
        />
      </GroundBand>
    </div>
  );
}
