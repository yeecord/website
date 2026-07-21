import logoSvg from "../public/img/logo.svg?raw";

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
        fontFamily: "Manrope, 'Noto Sans TC', 'Noto Sans SC'",
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
