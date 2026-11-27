import type { ReactNode } from "react";
import { googleFonts } from "takumi-js/helpers";
import lockup from "../public/brand/yeecord/lockup-white.png?inline";
import dino from "../public/brand/yeecord/poses/happy.png?inline";
import hills from "../public/home/scene/hills-tile.svg?inline";
import moon from "../public/home/scene/moon.svg?inline";

// One request for the whole build instead of one per og image: takumi's helper
// re-downloads every subset on each call and gives up after 5s, which is what
// times out on Cloudflare once the page count grows.
export const ogFonts = googleFonts({
  families: [
    { name: "Geist", weight: [500, 800] },
    { name: "Noto Sans TC", weight: [400, 500, 800] },
    { name: "Noto Sans SC", weight: [400, 500, 800] },
  ],
  timeout: 30_000,
});

const PRIMARY = "#86d17f";
const MUTED = "#9aa7b8";

// 首頁 dark mode 星星的位置，拿掉會落在文字上的幾顆，單位是畫面寬高的百分比
const STARS = [
  [8, 12],
  [24, 8],
  [33, 22],
  [42, 6],
  [58, 10],
  [66, 26],
  [74, 6],
  [86, 30],
  [92, 14],
];

const DINO_RATIO = 920 / 1024;
const HILLS_RATIO = 273 / 1998;
const HILLS_WIDTH = 1000;

/** 首頁 dark mode 的夜景：星星、月亮、遠山和站在右下角的機器龍，內容疊在左半邊 */
function Scene({
  dinoWidth,
  children,
}: {
  dinoWidth: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(180deg, #0d1524, #101a26 60%, #13201a)",
        color: "white",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Geist, 'Noto Sans TC', 'Noto Sans SC'",
      }}
    >
      {STARS.map(([left, top]) => (
        <div
          key={`${left}-${top}`}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: `${top}%`,
            width: "5px",
            height: "5px",
            borderRadius: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        />
      ))}

      <img
        src={moon}
        width={88}
        height={92}
        style={{ position: "absolute", top: "48px", right: "120px" }}
      />

      {[-240, 760].map((left) => (
        <img
          key={left}
          src={hills}
          width={HILLS_WIDTH}
          height={HILLS_WIDTH * HILLS_RATIO}
          style={{
            position: "absolute",
            left: `${left}px`,
            bottom: "28px",
            opacity: 0.6,
            filter: "brightness(0.34) saturate(1.6)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "40px",
          backgroundColor: "#16291d",
        }}
      />

      <img
        src={dino}
        width={dinoWidth}
        height={dinoWidth * DINO_RATIO}
        style={{
          position: "absolute",
          right: `${72 - dinoWidth * 0.25}px`,
          bottom: `${30 - dinoWidth * DINO_RATIO * 0.065}px`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "56px 72px 150px",
        }}
      >
        <img src={lockup} width={183} height={44} />
        {children}
      </div>
    </div>
  );
}

const muted = (fontSize: number) => ({
  fontSize: `${fontSize}px`,
  fontWeight: 500,
  lineHeight: 1.5,
  color: MUTED,
  margin: 0,
});

/** 站台總 banner：跟首頁 hero 同一句標語 */
export function SiteBanner() {
  return (
    <Scene dinoWidth={500}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <p
          style={{
            fontSize: "92px",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          一隻恐龍
        </p>
        <p
          style={{
            fontSize: "92px",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          搞定整個<span style={{ color: PRIMARY }}>伺服器</span>
        </p>
        <p style={{ ...muted(32), marginTop: "28px" }}>
          抽獎、身分組、動態語音，介面全中文
        </p>
      </div>
    </Scene>
  );
}

/** blog 文章：標題換文章，副標換作者和日期 */
export function BlogOgImage({
  title,
  date,
  authors,
}: {
  title: string;
  date: Date;
  authors: string[];
}) {
  return (
    <Scene dinoWidth={360}>
      <PageText
        title={title}
        description={[
          authors.join("、"),
          date.toLocaleDateString("zh-TW", { dateStyle: "long" }),
        ]
          .filter(Boolean)
          .join("，")}
      />
    </Scene>
  );
}

export function OgImage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Scene dinoWidth={360}>
      <PageText title={title} description={description} />
    </Scene>
  );
}

function PageText({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "auto",
        marginBottom: "auto",
        paddingRight: "300px",
      }}
    >
      <p
        style={{
          fontSize: "64px",
          fontWeight: 800,
          lineHeight: 1.28,
          letterSpacing: "-1.5px",
          margin: 0,
          lineClamp: 3,
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            ...muted(32),
            marginTop: "24px",
            lineClamp: 2,
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
