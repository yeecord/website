import Link from "fumadocs-core/link";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { Cheer } from "./Cheer";

export function Community({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="relative z-2">
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 px-4 pt-16 pb-48 text-center">
        <div className="relative">
          <span className="-right-6 -top-2 absolute animate-pulse motion-reduce:animate-none font-bold text-white/70 text-xl">
            z
          </span>
          <span className="-right-11 -top-7 absolute animate-pulse motion-reduce:animate-none font-bold text-lg text-white/50 [animation-delay:.4s]">
            z
          </span>
          <img
            alt=""
            src="/img/logo.svg"
            className="h-24 rotate-6 animate-[bob_7s_ease-in-out_infinite] motion-reduce:animate-none"
            draggable={false}
          />
        </div>
        <h2 className="text-balance font-bold text-3xl text-white tracking-tight sm:text-5xl">
          {t("把機器龍帶回家")}
        </h2>
        <p className="max-w-lg text-balance text-base text-white/75 sm:text-lg">
          {t("安裝免費，設定時遇到問題，到 Discord 社群問")}
        </p>
        <div className="flex w-full max-w-xs flex-col justify-center gap-3 pb-10 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap">
          <Cheer>
            <Link href={`${staticPath(locale, "/install")}/`} className="btn-chunky">
              {t("安裝機器人")}
            </Link>
          </Cheer>
          <Link
            href="https://discord.gg/yeecord"
            target="_blank"
            className="btn-chunky-secondary"
          >
            {t("加入 Discord 社群")}
          </Link>
        </div>
      </div>
    </div>
  );
}
