import Link from "fumadocs-core/link";
import { Deco, PixelDino } from "./decor";
import { DinoMascot } from "./DinoMascot";

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
      <div className="relative flex flex-col items-center gap-7 px-4 pt-20 pb-64 text-center md:pt-28">
        <Sky />
        <h1 className="font-bold text-5xl leading-[1.15] tracking-tight sm:text-6xl xl:text-7xl">
          一隻恐龍
          <br />
          搞定整個<span className="text-primary">伺服器</span>
        </h1>
        <p className="max-w-[34rem] text-lg text-muted-foreground sm:text-xl">
          YEE 式機器龍是全中文的 Discord
          機器人：抽獎、身分組、動態語音、找吃的小遊戲通通都有，而且全部免費。
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
      <div className="bg-hill-front pb-12">
        <ServerProof />
      </div>
    </div>
  );
}

function Sky() {
  return (
    <div className="-z-[1] absolute inset-0 overflow-hidden">
      <Deco name="sparkles" className="top-[16%] left-[13%]" size={24} twinkle />
      <Deco
        name="star"
        className="top-[38%] left-[21%]"
        size={14}
        delay={0.7}
        twinkle
      />
      <Deco
        name="sparkles"
        className="top-[58%] left-[8%]"
        size={17}
        delay={1.6}
        twinkle
      />
      <Deco
        name="star"
        className="top-[19%] right-[16%]"
        size={16}
        delay={0.4}
        twinkle
      />
      <Deco
        name="sparkles"
        className="top-[40%] right-[7%]"
        size={26}
        delay={1.1}
        twinkle
      />
      <Deco
        name="star"
        className="top-[10%] right-[34%]"
        size={12}
        delay={2}
        twinkle
      />
      <Deco
        name="star"
        className="top-[64%] right-[26%]"
        size={13}
        delay={1.4}
        twinkle
      />
    </div>
  );
}

function Hills() {
  return (
    <div className="-z-[1] absolute inset-x-0 bottom-0 overflow-hidden">
      <div className="-mb-14 sm:-mb-20 relative h-56">
        <div className="-left-[20%] absolute bottom-0 h-52 w-[75%] rounded-[50%] bg-hill-back" />
        <PixelDino
          className="bottom-[7.5rem] left-[13%] max-sm:hidden"
          size={64}
        />
        <div className="-right-[25%] absolute bottom-[-2rem] h-56 w-[85%] rounded-[50%] bg-hill-mid" />
        <div className="-inset-x-[10%] absolute bottom-[-5rem] h-44 rounded-[50%] bg-hill-front" />
        <Deco name="herb" className="bottom-4 left-[24%]" size={26} />
        <Deco name="blossom" className="bottom-10 left-[38%]" size={18} />
        <Deco name="seedling" className="bottom-2 left-[48%]" size={20} />
        <Deco name="herb" className="bottom-6 right-[30%]" size={20} />
        <Deco name="mushroom" className="bottom-12 right-[13%]" size={18} />
        <Deco name="blossom" className="bottom-3 right-[22%]" size={15} />
      </div>
    </div>
  );
}

function ServerProof() {
  return (
    <div className="mx-auto flex max-w-[60rem] flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-6">
      <div className="-space-x-3 flex shrink-0">
        {SERVERS.map((server) => (
          <img
            key={server.name}
            alt={server.name}
            title={server.name}
            src={server.img}
            width="44"
            height="44"
            className="size-11 rounded-full border-2 border-hill-front"
          />
        ))}
      </div>
      <p className="text-center sm:text-start">
        APEX Taiwan、VALORANT Taiwan 等
        <span className="mx-1 font-bold text-primary">350,000+</span>
        個伺服器都在用
      </p>
    </div>
  );
}
