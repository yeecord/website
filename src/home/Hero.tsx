import Link from "fumadocs-core/link";
import { DinoMascot } from "./DinoMascot";
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

export function Hero() {
  return (
    <div className="relative z-[2] w-full">
      <div className="relative flex flex-col items-center gap-7 px-4 pt-20 pb-56 text-center sm:pb-72 md:pt-28">
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
        <h1 className="font-bold text-5xl leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
          一隻恐龍
          <br />
          搞定整個<span className="text-primary">伺服器</span>
        </h1>
        <p className="max-w-[34rem] text-lg text-muted-foreground sm:text-xl">
          抽獎、身分組、動態語音、找吃的小遊戲，全中文介面，通通免費。
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/invite/" className="btn-chunky">
            免費安裝機器人
          </Link>
          <Link href="/zh-tw/docs" className="btn-chunky-secondary">
            看使用教學
          </Link>
        </div>
        <HillsLayer className="bottom-16 h-40" />
        <DinoMascot className="absolute bottom-10 right-[5%] sm:bottom-12 sm:right-[12%]" />
      </div>
      <GroundBand className="-mt-24">
        <Forest />
        <ServerProof />
      </GroundBand>
    </div>
  );
}

function Forest() {
  return (
    <div className="absolute inset-x-0 top-0">
      <Plant src="treePine" height={150} className="top-[-118px] left-[4%]" />
      <Plant
        src="bush1"
        height={44}
        className="top-[-14px] left-[11%] [animation-delay:-1.5s]"
      />
      <Plant
        src="treeSmall_green1"
        height={52}
        className="top-[-22px] left-[17%] [animation-delay:-3s] max-sm:hidden"
      />
      <Plant
        src="tree"
        height={110}
        className="top-[-80px] right-[24%] [animation-delay:-2s] max-md:hidden"
      />
      <Plant
        src="bush2"
        height={40}
        className="top-[-10px] right-[20%] [animation-delay:-4s]"
      />
      <Plant
        src="treeSmall_green2"
        height={48}
        className="top-[-16px] right-[3%] [animation-delay:-2.6s]"
      />
    </div>
  );
}

function ServerProof() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 pt-14 pb-10 sm:flex-row sm:gap-5">
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
      <p className="text-center font-medium leading-snug max-sm:text-sm">
        APEX Taiwan、VALORANT Taiwan 等
        <span className="mx-1 font-bold text-primary">350,000+</span>
        個伺服器都在用
      </p>
    </div>
  );
}
