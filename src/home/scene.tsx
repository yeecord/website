import clsx from "clsx";

/* 素材由 Gemini 照機器龍的畫風生成，描成 SVG；深色模式整體壓暗 */
/* 玩遊戲時背景淡下去，讓迎面來的障礙物看得清楚；遊戲裡入夜時再壓暗 */
const night = "group-data-night/hero:brightness-[.45]";
const dimmed = `[transition:opacity_.3s_ease-out,filter_1s_ease] group-data-game/hero:opacity-40 ${night}`;

export const plantDim = "dark:brightness-[.6] dark:saturate-[.75]";

/* 每個素材的寬高比，取自 SVG 的 viewBox */
const RATIO = {
  bush: 784 / 584,
  flowers: 566 / 448,
  pine: 590 / 838,
  sapling: 301 / 452,
  tree: 612 / 730,
  "cloud-wide": 704 / 342,
  "cloud-small": 659 / 400,
};

export type PlantKind = "bush" | "flowers" | "pine" | "sapling" | "tree";

export function plantWidth(kind: PlantKind, height: number) {
  return Math.round(height * RATIO[kind]);
}

export function Cloud({
  kind,
  className,
  width,
}: {
  kind: "wide" | "small";
  className?: string;
  width: number;
}) {
  return (
    <img
      src={`/home/scene/cloud-${kind}.svg`}
      alt=""
      width={width}
      height={Math.round(width / RATIO[`cloud-${kind}`])}
      draggable={false}
      className={clsx(
        "absolute animate-[cloud-drift_40s_ease-in-out_infinite_alternate] select-none motion-reduce:animate-none dark:opacity-15 dark:group-data-game/hero:opacity-[.06]",
        dimmed,
        className,
      )}
    />
  );
}

export function Plant({
  kind,
  className,
  height,
}: {
  kind: PlantKind;
  className?: string;
  height: number;
}) {
  return (
    <img
      src={`/home/scene/${kind}.svg`}
      alt=""
      width={plantWidth(kind, height)}
      height={height}
      draggable={false}
      className={clsx(
        "absolute origin-bottom animate-[sway_5.5s_ease-in-out_infinite] select-none motion-reduce:animate-none",
        dimmed,
        plantDim,
        className,
      )}
    />
  );
}

/* 天空：恐龍和植物都站在它的底邊上 */
export function Sky({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-clip bg-linear-to-b from-[#D9E8FF] via-[#E8F1FF] to-[#F2F8FF] dark:from-[#0D1524] dark:via-[#101A26] dark:to-[#13201A]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0D1524] via-[#101A26] to-[#1A2A22] opacity-0 transition-opacity duration-1000 group-data-night/hero:opacity-100"
      />
      <SkyLights />
      {children}
    </div>
  );
}

/* 淺色模式一顆慢慢呼吸的太陽，深色模式換成月亮和會閃的星星 */
function SkyLights() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-300 group-data-game/hero:opacity-40"
    >
      <div className="absolute top-[4%] right-[15%] transition-opacity duration-1000 max-lg:top-0 max-lg:right-[3%] dark:hidden group-data-night/hero:opacity-0">
        <img
          src="/home/scene/sun.svg"
          alt=""
          width={150}
          height={150}
          className="animate-[glow_7s_ease-in-out_infinite] motion-reduce:animate-none max-lg:w-20 max-sm:w-14"
        />
      </div>
      <div className="absolute top-[22%] left-[9%] animate-[cloud-drift_80s_ease-in-out_infinite_alternate] [--drift:38vw] motion-reduce:animate-none max-lg:hidden">
        <img
          src="/home/scene/balloon.svg"
          alt=""
          width={56}
          height={80}
          className="animate-[float_3s_ease-in-out_infinite_alternate] motion-reduce:animate-none dark:brightness-[.5]"
        />
      </div>
      <img
        src="/home/scene/moon.svg"
        alt=""
        width={92}
        height={96}
        className="absolute top-[6%] right-[18%] opacity-0 transition-opacity duration-1000 max-lg:top-[1%] max-lg:right-[4%] max-lg:w-14 max-sm:w-11 dark:opacity-100 group-data-night/hero:opacity-100"
      />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 dark:opacity-100 group-data-night/hero:opacity-100">
        {STARS.map(([left, top, delay]) => (
          <span
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
            className="absolute size-1 animate-[twinkle_4s_ease-in-out_infinite] rounded-full bg-white/80 motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

const STARS = [
  [8, 12, 0], [15, 30, -1.2], [24, 8, -2.4], [33, 22, -0.6], [42, 6, -3.1], [58, 10, -1.8],
  [66, 26, -2.9], [74, 6, -0.3], [86, 30, -2.2], [92, 14, -1.1], [50, 40, -3.4], [12, 46, -1.6],
];

/* 玩遊戲時跟著跑步往後捲的一層（DinoGame 依 data-parallax 的倍率移動它）。
   內容在左右各複製幾份接起來，捲過一個週期就接回原位；mirror 時隔一份鏡像，給左右邊緣接不起來的山丘用 */
export function Scroller({
  factor,
  mirror = false,
  children,
}: {
  factor: number;
  mirror?: boolean;
  children: React.ReactNode;
}) {
  const offsets = mirror ? [-2, -1, 0, 1] : [-1, 0];

  return (
    <div aria-hidden data-parallax={factor} data-period={mirror ? 2 : 1} className="absolute inset-0">
      {offsets.map((k) => (
        <div
          key={k}
          /* 相鄰的複本重疊 1 px，蓋掉接縫的次像素空隙 */
          style={{ transform: `translateX(calc(${k * 100}% - ${k}px))${mirror && k % 2 !== 0 ? " scaleX(-1)" : ""}` }}
          className="absolute inset-0"
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* 遠方山丘上的小村莊：房子是一個個伺服器社群，煙囪冒煙、風車在轉 */
export function Village({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-x-0 bottom-0", dimmed, className)}>
      <Scroller factor={0.25}>
        <Cottage className="bottom-[46%] left-[24%] w-12 sm:w-16" smokeDelay={0} />
        <Cottage className="bottom-[58%] left-[31%] w-8 sm:w-11 max-lg:hidden" smokeDelay={-1.3} />
        <Windmill className="bottom-[40%] left-[46%] w-10 sm:w-14 max-sm:hidden" />
        <Cottage className="bottom-[50%] left-[38%] w-9 sm:w-12 max-xl:hidden" smokeDelay={-2.1} />
      </Scroller>
    </div>
  );
}

/* 煙囪在素材寬 76%、頂端的位置 */
function Cottage({ className, smokeDelay }: { className: string; smokeDelay: number }) {
  return (
    <div className={clsx("absolute", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${smokeDelay - i * 1.1}s` }}
          className="absolute top-0 left-[72%] size-2.5 animate-[smoke_3.3s_ease-out_infinite] rounded-full bg-white/80 motion-reduce:hidden dark:bg-white/25 sm:size-3"
        />
      ))}
      <img src="/home/scene/cottage.svg" alt="" draggable={false} className="relative w-full select-none dark:brightness-[.6]" />
    </div>
  );
}

/* 扇葉的軸心在塔身寬 51%、高 24% 的位置 */
function Windmill({ className }: { className: string }) {
  return (
    <div className={clsx("absolute", className)}>
      <img src="/home/scene/windmill.svg" alt="" draggable={false} className="w-full select-none dark:brightness-[.6]" />
      <img
        src="/home/scene/sails.svg"
        alt=""
        draggable={false}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-[24%] left-[51%] w-[150%] max-w-none animate-[spin_12s_linear_infinite] select-none motion-reduce:animate-none dark:brightness-[.6]"
      />
    </div>
  );
}

/* 坐在樹叢旁的兔子，隔幾秒跳兩下 */
export function Rabbit({ className }: { className?: string }) {
  return (
    <img
      src="/home/scene/rabbit.svg"
      alt=""
      draggable={false}
      className={clsx(
        "absolute h-7 w-auto animate-[hop_5s_ease-out_infinite] select-none motion-reduce:animate-none sm:h-9",
        dimmed,
        plantDim,
        className,
      )}
    />
  );
}

export function HillsLayer({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("absolute inset-x-0 bottom-0 overflow-hidden", dimmed, className)}>
      <div className="absolute inset-0 animate-[hill-drift_40s_ease-in-out_infinite_alternate] [--drift:3%] motion-reduce:animate-none">
        <Scroller factor={0.25} mirror>
          <img
            src="/home/scene/hills.svg"
            alt=""
            draggable={false}
            className="size-full select-none dark:brightness-[.34] dark:saturate-[1.6]"
          />
        </Scroller>
      </div>
    </div>
  );
}

export function GroundBand({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-x-clip bg-[#A8E2B3] [transition:filter_1s_ease] dark:bg-[#16291D]", night, className)}>
      <div className="absolute inset-x-0 bottom-[calc(100%-2px)] h-3">
        <Scroller factor={1}>
          <svg viewBox="0 0 1440 16" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <path className="fill-[#A8E2B3] dark:fill-[#16291D]" d="M0 14Q3.2 6 8.0 6Q12.8 6 16 14Q19.6 8 25.0 8Q30.4 8 34 14Q36.4 8 40.0 8Q43.6 8 46 14Q49.2 8 54.0 8Q58.8 8 62 14Q64.8 8 69.0 8Q73.2 8 76 14Q78.4 2 82.0 2Q85.6 2 88 14Q91.6 8 97.0 8Q102.4 8 106 14Q108.8 8 113.0 8Q117.2 8 120 14Q123.6 8 129.0 8Q134.4 8 138 14Q140.4 6 144.0 6Q147.6 6 150 14Q152.4 2 156.0 2Q159.6 2 162 14Q164.4 6 168.0 6Q171.6 6 174 14Q176.4 6 180.0 6Q183.6 6 186 14Q189.2 2 194.0 2Q198.8 2 202 14Q204.8 8 209.0 8Q213.2 8 216 14Q219.2 6 224.0 6Q228.8 6 232 14Q234.4 6 238.0 6Q241.6 6 244 14Q247.2 8 252.0 8Q256.8 8 260 14Q262.4 8 266.0 8Q269.6 8 272 14Q274.8 2 279.0 2Q283.2 2 286 14Q289.6 4 295.0 4Q300.4 4 304 14Q307.6 2 313.0 2Q318.4 2 322 14Q325.2 4 330.0 4Q334.8 4 338 14Q340.8 6 345.0 6Q349.2 6 352 14Q354.8 8 359.0 8Q363.2 8 366 14Q369.2 2 374.0 2Q378.8 2 382 14Q385.2 2 390.0 2Q394.8 2 398 14Q401.2 8 406.0 8Q410.8 8 414 14Q416.4 2 420.0 2Q423.6 2 426 14Q428.8 4 433.0 4Q437.2 4 440 14Q442.8 2 447.0 2Q451.2 2 454 14Q457.6 8 463.0 8Q468.4 8 472 14Q474.4 4 478.0 4Q481.6 4 484 14Q487.2 4 492.0 4Q496.8 4 500 14Q503.6 2 509.0 2Q514.4 2 518 14Q520.4 8 524.0 8Q527.6 8 530 14Q533.2 2 538.0 2Q542.8 2 546 14Q548.4 8 552.0 8Q555.6 8 558 14Q561.2 2 566.0 2Q570.8 2 574 14Q577.2 2 582.0 2Q586.8 2 590 14Q593.2 8 598.0 8Q602.8 8 606 14Q609.6 4 615.0 4Q620.4 4 624 14Q626.8 8 631.0 8Q635.2 8 638 14Q641.6 8 647.0 8Q652.4 8 656 14Q658.8 4 663.0 4Q667.2 4 670 14Q672.8 6 677.0 6Q681.2 6 684 14Q687.6 2 693.0 2Q698.4 2 702 14Q705.6 8 711.0 8Q716.4 8 720 14Q722.8 2 727.0 2Q731.2 2 734 14Q737.6 4 743.0 4Q748.4 4 752 14Q754.8 2 759.0 2Q763.2 2 766 14Q769.2 2 774.0 2Q778.8 2 782 14Q785.2 2 790.0 2Q794.8 2 798 14Q800.8 6 805.0 6Q809.2 6 812 14Q814.4 6 818.0 6Q821.6 6 824 14Q826.8 6 831.0 6Q835.2 6 838 14Q840.8 8 845.0 8Q849.2 8 852 14Q855.6 6 861.0 6Q866.4 6 870 14Q873.2 4 878.0 4Q882.8 4 886 14Q888.4 6 892.0 6Q895.6 6 898 14Q901.6 4 907.0 4Q912.4 4 916 14Q919.2 6 924.0 6Q928.8 6 932 14Q934.4 2 938.0 2Q941.6 2 944 14Q947.6 2 953.0 2Q958.4 2 962 14Q965.6 2 971.0 2Q976.4 2 980 14Q982.4 2 986.0 2Q989.6 2 992 14Q995.6 8 1001.0 8Q1006.4 8 1010 14Q1012.8 8 1017.0 8Q1021.2 8 1024 14Q1026.8 2 1031.0 2Q1035.2 2 1038 14Q1040.8 8 1045.0 8Q1049.2 8 1052 14Q1055.2 8 1060.0 8Q1064.8 8 1068 14Q1070.4 8 1074.0 8Q1077.6 8 1080 14Q1082.8 8 1087.0 8Q1091.2 8 1094 14Q1097.2 8 1102.0 8Q1106.8 8 1110 14Q1112.4 6 1116.0 6Q1119.6 6 1122 14Q1125.6 6 1131.0 6Q1136.4 6 1140 14Q1143.2 4 1148.0 4Q1152.8 4 1156 14Q1159.2 2 1164.0 2Q1168.8 2 1172 14Q1174.4 8 1178.0 8Q1181.6 8 1184 14Q1187.6 2 1193.0 2Q1198.4 2 1202 14Q1205.6 2 1211.0 2Q1216.4 2 1220 14Q1223.2 8 1228.0 8Q1232.8 8 1236 14Q1238.8 8 1243.0 8Q1247.2 8 1250 14Q1253.2 4 1258.0 4Q1262.8 4 1266 14Q1269.6 6 1275.0 6Q1280.4 6 1284 14Q1286.4 6 1290.0 6Q1293.6 6 1296 14Q1299.2 6 1304.0 6Q1308.8 6 1312 14Q1314.4 4 1318.0 4Q1321.6 4 1324 14Q1326.4 4 1330.0 4Q1333.6 4 1336 14Q1339.2 6 1344.0 6Q1348.8 6 1352 14Q1355.2 6 1360.0 6Q1364.8 6 1368 14Q1371.2 6 1376.0 6Q1380.8 6 1384 14Q1386.8 6 1391.0 6Q1395.2 6 1398 14Q1401.6 6 1407.0 6Q1412.4 6 1416 14Q1418.8 2 1423.0 2Q1427.2 2 1430 14Q1433.2 8 1435.0 8Q1436.8 8 1440 14V16H0Z" />
          </svg>
        </Scroller>
      </div>
      <div className="relative">{children}</div>
      <svg
        aria-hidden
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-full h-8 w-full"
      >
        <path
          className="fill-[#A8E2B3] dark:fill-[#16291D]"
          d="M0 0H1440V18C1300 34 1160 38 1010 26S720 6 560 18 250 40 0 24Z"
        />
      </svg>
    </div>
  );
}
