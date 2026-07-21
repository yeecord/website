import Link from "fumadocs-core/link";
import { GrassTuft, Star } from "./decor";

export function Community() {
  return (
    <div className="relative z-[2] mt-40 overflow-hidden">
      <div className="relative flex flex-col items-center gap-6 px-4 pt-16 pb-24 text-center">
        <div className="-z-[1] absolute inset-0 overflow-hidden">
          <Star className="top-[12%] left-[18%]" size={13} delay={0.5} />
          <Star className="top-[30%] right-[14%]" size={15} delay={1.3} />
          <Star className="top-[8%] right-[30%]" size={9} delay={2.1} />
          <div className="-inset-x-[15%] absolute bottom-[-9rem] h-64 rounded-[50%] bg-hill-front" />
          <GrassTuft className="bottom-6 left-[22%]" />
          <GrassTuft className="bottom-3 right-[26%]" width={16} />
        </div>
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
            className="h-24 rotate-6"
            draggable={false}
          />
        </div>
        <h2 className="font-bold text-4xl tracking-tight sm:text-5xl">
          把機器龍帶回家
        </h2>
        <p className="max-w-[32rem] text-lg text-muted-foreground">
          安裝免費，設定五分鐘。卡關了就來 Discord 社群喊一聲，我們都在。
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-3">
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
    </div>
  );
}
