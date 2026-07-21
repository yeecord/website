import Link from "fumadocs-core/link";

export function Community() {
  return (
    <div className="relative z-[2] mt-40 overflow-hidden">
      <div className="relative flex flex-col items-center gap-6 px-4 pt-16 pb-24 text-center">
        <div className="-z-[1] absolute inset-x-0 bottom-0 overflow-hidden">
          <div className="-inset-x-[15%] absolute bottom-[-9rem] h-64 rounded-[50%] bg-hill-front" />
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
    </div>
  );
}
