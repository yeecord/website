import Link from "fumadocs-core/link";
import { contentPath, type Locale, staticPath } from "~/i18n";
import { type Translate, translator } from "~/i18n/translate";
import { DinoGame } from "./DinoGame";
import { Cloud, GroundBand, HillsLayer, Plant } from "./scene";

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
    <div className="relative z-2 w-full">
      <div className="relative flex flex-col items-center gap-6 px-4 pt-16 pb-52 text-center sm:gap-7 sm:pt-20 sm:pb-72 md:pt-28">
        <Cloud n={1} width={190} className="top-[4%] left-[6%] max-sm:w-24" />
        <Cloud
          n={2}
          width={130}
          className="top-[34%] left-[20%] opacity-80 [animation-delay:-6s] max-sm:hidden"
        />
        <Cloud
          n={3}
          width={230}
          className="top-[8%] right-[7%] [animation-delay:-11s] max-sm:top-[3%] max-sm:w-28"
        />
        <Cloud
          n={1}
          width={110}
          className="top-[46%] right-[19%] opacity-70 [animation-delay:-3s] max-sm:hidden"
        />
        <h1 className="text-balance font-bold text-[2.6rem] leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
          {t("一隻恐龍")}
          <br />
          {t("搞定整個")}
          <span className="text-primary">{t("伺服器")}</span>
        </h1>
        <p className="max-w-136 text-base text-muted-foreground text-pretty sm:text-lg md:text-xl">
          {t("抽獎、身分組、動態語音、找吃的小遊戲，全中文介面，通通免費。")}
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
        <HillsLayer className="bottom-16 h-40" />
        <DinoGame locale={locale} alt={t("YEE 式機器龍")} />
      </div>
      <GroundBand className="-mt-24">
        <Forest />
        <ServerProof t={t} />
      </GroundBand>
    </div>
  );
}

function Forest() {
  return (
    <div className="absolute inset-x-0 top-0">
      <Plant src="treePine" height={150} className="-top-29.5 left-[4%]" />
      <Plant
        src="bush1"
        height={44}
        className="-top-3.5 left-[11%] [animation-delay:-1.5s]"
      />
      <Plant
        src="treeSmall_green1"
        height={52}
        className="-top-5.5 left-[17%] [animation-delay:-3s] max-sm:hidden"
      />
      <Plant
        src="tree"
        height={110}
        className="-top-20 right-[24%] [animation-delay:-2s] max-md:hidden"
      />
      <Plant
        src="bush2"
        height={40}
        className="-top-2.5 right-[20%] [animation-delay:-4s]"
      />
      <Plant
        src="treeSmall_green2"
        height={48}
        className="-top-4 right-[3%] [animation-delay:-2.6s]"
      />
    </div>
  );
}

function ServerProof({ t }: { t: Translate }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 pt-5 pb-8 sm:flex-row sm:gap-5">
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
        <span className="mx-1 font-bold text-primary">350,000+</span>
        {t("個伺服器都在用")}
      </p>
    </div>
  );
}
