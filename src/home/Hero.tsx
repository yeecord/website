import Link from "fumadocs-core/link";
import { contentPath, type Locale, staticPath } from "~/i18n";
import { type Translate, translator } from "~/i18n/translate";
import { DinoGame } from "./DinoGame";
import { ServerCount } from "./ServerCount";
import { Cloud, GroundBand, Plant, Rabbit, Scroller, Sky, Village } from "./scene";

const SERVERS = [
  { img: "/home/customers/apex-tw.png", name: "APEX Taiwan" },
  { img: "/home/customers/valorant-tw.png", name: "VALORANT Taiwan" },
  { img: "/home/customers/avery.png", name: "Avery" },
  { img: "/home/customers/zeitfrei.png", name: "ZeitFrei" },
  { img: "/home/customers/daptor.png", name: "有感筆電軍團 - Daptor Army" },
  { img: "/home/customers/empressival.png", name: "Empressival" },
  { img: "/home/customers/daidai.png", name: "老查呆呆の迷因調查局總部" },
];

export function Hero({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div data-hero className="group/hero relative z-2 w-full">
      <Sky>
        <div className="relative flex flex-col items-center px-4 pt-16 pb-52 text-center sm:pt-20 sm:pb-72 md:pt-28"
        >
          <Scroller factor={0.08}>
            <Cloud
              kind="wide"
              width={200}
              className="top-[5%] left-[6%] [--drift:80px] [animation-duration:48s] max-lg:w-36 max-sm:w-24"
            />
            <Cloud
              kind="small"
              width={110}
              className="top-[36%] left-[18%] opacity-80 [--drift:-56px] [animation-duration:32s] max-lg:hidden"
            />
            <Cloud
              kind="wide"
              width={240}
              className="top-[9%] right-[7%] [--drift:-90px] [animation-duration:56s] max-lg:top-[3%] max-lg:right-[10%] max-lg:w-28 max-sm:top-[3%] max-sm:w-24"
            />
            <Cloud
              kind="small"
              width={90}
              className="top-[40%] right-[24%] opacity-70 [--drift:48px] [animation-duration:26s] max-lg:hidden"
            />
          </Scroller>
          <div
            data-hero-copy
            className="relative flex flex-col items-center gap-6 transition-[opacity,transform] duration-320 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-game/hero:pointer-events-none group-data-game/hero:-translate-y-4 group-data-game/hero:opacity-0 group-data-game/hero:duration-180 motion-reduce:transition-none sm:gap-7"
          >
            <h1 className="text-balance font-bold text-[2.6rem] leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
              {t("一隻恐龍")}
              <br />
              {t("搞定整個")}
              <span className="text-primary">{t("伺服器")}</span>
            </h1>
            <p className="max-w-136 text-base text-muted-foreground text-pretty sm:text-lg md:text-xl">
              {t("抽獎、身分組、動態語音，介面全中文，免費使用")}
            </p>
            <div className="flex w-full max-w-xs flex-col justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <Link href={`${staticPath(locale, "/install")}/`} className="btn-chunky">
                {t("安裝機器人")}
              </Link>
              <Link
                href={contentPath(locale, "/docs")}
                className="btn-chunky-secondary"
              >
                {t("看使用教學")}
              </Link>
            </div>
          </div>
          <Village className="h-32 sm:h-44" />
          <DinoGame locale={locale} alt={t("YEE 式機器龍")} />
        </div>
      </Sky>
      <GroundBand>
        <Scroller factor={1}>
          <Forest />
        </Scroller>
        <ServerProof t={t} />
      </GroundBand>
    </div>
  );
}

function Forest() {
  return (
    <div className="absolute inset-x-0 top-0">
      <Plant kind="pine" height={150} className="bottom-full right-[4%] max-sm:h-24 max-sm:w-auto" />
      <Plant kind="bush" height={46} className="bottom-full right-[10%] [animation-delay:-1.5s]" />
      <Rabbit className="bottom-full right-[13.5%] max-sm:hidden" />
      <Plant
        kind="flowers"
        height={36}
        className="bottom-full right-[16%] [animation-delay:-3s] max-sm:hidden"
      />
      <Plant
        kind="tree"
        height={120}
        className="bottom-full left-[33%] [animation-delay:-2s] max-lg:hidden"
      />
      <Plant
        kind="flowers"
        height={30}
        className="bottom-full left-[8%] [animation-delay:-4s] max-sm:hidden"
      />
      <Plant
        kind="bush"
        height={40}
        className="bottom-full left-[3%] [animation-delay:-2.6s]"
      />
    </div>
  );
}

function ServerProof({ t }: { t: Translate }) {
  return (
    <div
      data-hero-copy
      className="flex flex-col items-center justify-center gap-3 px-4 pt-8 pb-6 transition-opacity duration-320 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-game/hero:pointer-events-none group-data-game/hero:opacity-0 group-data-game/hero:duration-180 motion-reduce:transition-none sm:flex-row sm:gap-5"
    >
      <div className="-space-x-3 flex shrink-0 items-center">
        {SERVERS.map((server) => (
          <img
            key={server.name}
            alt={server.name}
            title={server.name}
            src={server.img}
            width="40"
            height="40"
            className="size-10 rounded-full border-2 border-white/70 shadow-sm"
          />
        ))}
      </div>
      <p className="text-balance text-center font-medium leading-snug max-sm:text-sm">
        {t("APEX Taiwan、VALORANT Taiwan 等")}
        <ServerCount value={350000} suffix="+" className="mx-1 font-bold text-[#17713A] dark:text-primary" />
        {t("個伺服器都在用")}
      </p>
    </div>
  );
}
