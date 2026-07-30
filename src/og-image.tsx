import type { ReactNode } from "react";
import { googleFonts } from "takumi-js/helpers";
import cloud1 from "../public/home/scene/cloud1.png?inline";
import cloud2 from "../public/home/scene/cloud2.png?inline";
import cloud3 from "../public/home/scene/cloud3.png?inline";
import logoSvg from "../public/img/logo.svg?raw";

// 跟首頁同一批 Kenney 雲，比例取自原始檔尺寸
const clouds = [
  { src: cloud1, ratio: 242 / 406 },
  { src: cloud2, ratio: 312 / 392 },
  { src: cloud3, ratio: 278 / 432 },
];

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

const GREEN = "#6bb369";
const BLURPLE = "#5865f2";

function Logo({ size }: { size: number }) {
  return <img src={logoSvg} width={size * (1580 / 2083)} height={size} />;
}

type Pill = { w: number; bg: string; avatar?: string };

const gradient = (from: string, to: string) =>
  `linear-gradient(120deg, ${from}, ${to})`;

const DEEP = gradient("#33562d", "#26401f");
const DIM = gradient("#4c854a", "#3a663a");
const BRIGHT = gradient("#82c980", "#57a355");
const PURPLE = gradient("#6b78ff", "#4d58d8");

const CHAT_ROWS: Pill[][] = [
  [
    { w: 210, bg: DEEP, avatar: GREEN },
    { w: 120, bg: DIM },
    { w: 320, bg: DEEP },
    { w: 90, bg: PURPLE, avatar: "#a3abff" },
    { w: 260, bg: DIM },
    { w: 180, bg: DEEP },
  ],
  [
    { w: 150, bg: DIM },
    { w: 340, bg: BRIGHT, avatar: "#e3f2e2" },
    { w: 110, bg: DEEP },
    { w: 230, bg: DIM },
    { w: 80, bg: DEEP },
    { w: 300, bg: PURPLE },
  ],
];

function ChatStrip() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginTop: "auto",
      }}
    >
      {CHAT_ROWS.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            marginLeft: i === 1 ? "-60px" : "0",
          }}
        >
          {row.map((pill, j) => (
            <div
              key={j}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "12px",
                width: `${pill.w}px`,
                height: "34px",
                flexShrink: 0,
                borderRadius: "17px",
                backgroundImage: pill.bg,
                paddingLeft: pill.avatar ? "6px" : "0",
              }}
            >
              {pill.avatar && (
                <div
                  style={{
                    display: "flex",
                    width: "22px",
                    height: "22px",
                    borderRadius: "11px",
                    backgroundColor: pill.avatar,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Cloud({
  n,
  top,
  left,
  width,
  opacity = 0.25,
}: {
  n: 1 | 2 | 3;
  top: number;
  left: number;
  width: number;
  opacity?: number;
}) {
  const cloud = clouds[n - 1];

  return (
    <img
      src={cloud.src}
      width={width}
      height={width * cloud.ratio}
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        opacity,
      }}
    />
  );
}

/** 首頁 hero 的夜空：雲和貼著下緣的大恐龍，內容疊在左半邊 */
function Scene({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0e120e",
        color: "white",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Geist, 'Noto Sans TC', 'Noto Sans SC'",
      }}
    >
      <Cloud n={1} top={64} left={560} width={130} opacity={0.16} />
      <Cloud n={3} top={40} left={860} width={230} />
      <Cloud n={2} top={200} left={1010} width={120} opacity={0.18} />

      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "84px",
          bottom: "-26px",
        }}
      >
        <Logo size={300} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "52px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <Logo size={48} />
          <p style={{ fontSize: "34px", fontWeight: 800, margin: 0 }}>
            Yeecord
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

/** 站台總 banner：取代以前的靜態 branding 圖 */
export function SiteBanner() {
  return (
    <Scene>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "64px",
        }}
      >
        <p
          style={{
            fontSize: "88px",
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          一隻恐龍
        </p>
        <p
          style={{
            fontSize: "88px",
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          搞定整個<span style={{ color: "#82c980" }}>伺服器</span>
        </p>
        <p
          style={{
            fontSize: "32px",
            fontWeight: 500,
            color: "#96a398",
            margin: 0,
            marginTop: "28px",
          }}
        >
          350,000+ 個伺服器都在用
        </p>
      </div>
    </Scene>
  );
}

/** blog 文章專用：跟站台 banner 同一張夜景，標題換文章、副標換作者和日期 */
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
    <Scene>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
          paddingBottom: "40px",
          paddingRight: "330px",
        }}
      >
        <p
          style={{
            fontSize: "60px",
            fontWeight: 800,
            lineHeight: 1.32,
            letterSpacing: "-1.5px",
            margin: 0,
            lineClamp: 3,
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "30px",
            fontWeight: 500,
            color: "#96a398",
            margin: 0,
            marginTop: "26px",
          }}
        >
          {[
            authors.join("、"),
            date.toLocaleDateString("zh-TW", { dateStyle: "long" }),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0e120e",
        color: "white",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Geist, 'Noto Sans TC', 'Noto Sans SC'",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "56px 72px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <Logo size={48} />
          <p style={{ fontSize: "34px", fontWeight: 800, margin: 0 }}>
            Yeecord
          </p>
        </div>

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
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-1.5px",
              margin: 0,
              lineClamp: 2,
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
          {description && (
            <p
              style={{
                fontSize: "38px",
                fontWeight: 500,
                lineHeight: 1.6,
                color: "#96a398",
                margin: 0,
                marginTop: "24px",
                lineClamp: 2,
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "150px",
          flexShrink: 0,
          justifyContent: "flex-end",
          paddingBottom: "44px",
        }}
      >
        <ChatStrip />
      </div>
    </div>
  );
}
