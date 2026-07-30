import { googleFonts } from "takumi-js/helpers";
import logoSvg from "../public/img/logo.svg?raw";

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
  top,
  left,
  width,
  opacity = 1,
}: {
  top: number;
  left: number;
  width: number;
  opacity?: number;
}) {
  const h = width * 0.34;

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${h}px`,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${width}px`,
          height: `${h * 0.62}px`,
          borderRadius: `${h * 0.31}px`,
          backgroundColor: "#252b25",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: `${width * 0.22}px`,
          width: `${width * 0.44}px`,
          height: `${width * 0.44}px`,
          borderRadius: "9999px",
          backgroundColor: "#252b25",
        }}
      />
    </div>
  );
}

function Bush({
  bottom,
  left,
  size,
  bg,
}: {
  bottom: number;
  left: number;
  size: number;
  bg: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        bottom: `${bottom}px`,
        left: `${left}px`,
        width: `${size}px`,
        height: `${size * 0.62}px`,
        borderRadius: `${size * 0.31}px`,
        backgroundImage: bg,
      }}
    />
  );
}

/** 遠丘、近丘、地面三層，跟首頁 GroundBand 同一套綠 */
function Ground({ height = 84 }: { height?: number }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: "-260px",
          bottom: `${height - 514}px`,
          width: "1100px",
          height: "560px",
          borderRadius: "9999px",
          backgroundImage: DIM,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "-300px",
          bottom: `${height - 554}px`,
          width: "1250px",
          height: "600px",
          borderRadius: "9999px",
          backgroundImage: DIM,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: `${height}px`,
          backgroundImage: DEEP,
        }}
      />
      <Bush bottom={height - 14} left={120} size={64} bg={BRIGHT} />
      <Bush bottom={height - 20} left={330} size={44} bg={DIM} />
      <Bush bottom={height - 12} left={700} size={52} bg={BRIGHT} />
    </>
  );
}

/** 站台總 banner：首頁 hero 的夜景搬進 og 圖，取代以前的靜態 branding 圖 */
export function SiteBanner() {
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
      <Cloud top={64} left={560} width={130} opacity={0.55} />
      <Cloud top={40} left={860} width={230} />
      <Cloud top={200} left={1010} width={120} opacity={0.6} />
      <Ground />

      {/* 恐龍站在地面上 */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "84px",
          bottom: "58px",
        }}
      >
        <Logo size={295} />
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
      </div>
    </div>
  );
}

/** blog 文章專用：夜景地面 + 日期、作者、標籤，跟 docs 的聊天泡泡版區隔 */
export function BlogOgImage({
  title,
  description,
  date,
  authors,
  tags,
}: {
  title: string;
  description?: string;
  date: Date;
  authors: string[];
  tags: string[];
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
      <Cloud top={52} left={700} width={150} opacity={0.7} />
      <Cloud top={150} left={990} width={110} opacity={0.5} />
      <Ground height={64} />

      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "64px",
          bottom: "34px",
        }}
      >
        <Logo size={150} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "52px 72px 0",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "9999px",
              backgroundColor: "rgba(130, 201, 128, 0.16)",
              color: "#82c980",
              padding: "4px 18px",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            Blog
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: "auto",
            paddingRight: "40px",
          }}
        >
          <p
            style={{
              fontSize: "62px",
              fontWeight: 800,
              lineHeight: 1.3,
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
                fontSize: "34px",
                fontWeight: 500,
                lineHeight: 1.6,
                color: "#96a398",
                margin: 0,
                marginTop: "22px",
                lineClamp: 2,
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "14px",
            marginBottom: "104px",
            paddingRight: "220px",
            fontSize: "27px",
            fontWeight: 500,
            color: "#96a398",
          }}
        >
          <p style={{ margin: 0 }}>
            {[
              authors.join("、"),
              date.toLocaleDateString("zh-TW", { dateStyle: "long" }),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "rgba(130, 201, 128, 0.14)",
                color: "#82c980",
                padding: "0 14px",
                fontSize: "24px",
                lineHeight: 1,
              }}
            >
              # {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
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
