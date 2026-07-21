import Link from "fumadocs-core/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export function Community() {
  return (
    <div className="z-[2] my-40 flex flex-col items-center gap-6 px-4 text-center">
      <img
        alt=""
        src="/img/logo.svg"
        className="h-24 animate-[updown_4s_infinite]"
      />
      <h2 className="font-bold text-4xl tracking-tight sm:text-5xl">
        把機器龍帶回家
      </h2>
      <p className="max-w-[32rem] text-lg text-muted-foreground">
        安裝免費，設定五分鐘。卡關了就來 Discord 社群喊一聲，我們都在。
      </p>
      <div className="flex flex-row flex-wrap justify-center gap-3">
        <Link
          href="/invite/"
          className={cn(buttonVariants({ color: "primary", size: "lg" }))}
        >
          免費安裝機器人
        </Link>
        <Link
          href="https://discord.gg/yeecord"
          target="_blank"
          className={cn(buttonVariants({ color: "secondary", size: "lg" }))}
        >
          加入 Discord 社群
        </Link>
      </div>
      <div className="flex flex-row gap-5 text-muted-foreground text-sm">
        <Link
          href="https://x.com/yeecord"
          target="_blank"
          className="hover:text-foreground"
        >
          X @yeecord
        </Link>
        <Link
          href="https://github.com/yeecord"
          target="_blank"
          className="hover:text-foreground"
        >
          GitHub 貢獻
        </Link>
      </div>
    </div>
  );
}
