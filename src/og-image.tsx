const GREEN = "#4ade80";
const CYAN = "#22d3ee";

function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128">
      <path
        d="M43.3522 25.2578C52.946 9.29013 72.5335 4.51549 81.128 4.12413C85.15 3.46785 94.7859 5.5398 99 7.38145C103.214 9.22311 107.699 10.3815 114.5 18.8815C121.301 27.3815 123 41.8815 123 51.8815C123 61.8815 118.222 77.4108 109.31 84.5494C107.413 86.0689 103.482 87.3457 98.5168 88.4495V115.881C98.5168 120.3 94.9351 123.881 90.5168 123.881H57.3483C52.9301 123.881 49.3483 120.3 49.3483 115.881V94.9799C35.5571 94.9799 23.5649 92.768 17.5687 89.8328C11.5725 86.8976 1.97863 78.6789 4.37712 65.1769C6.85518 51.2269 23.5648 46.9785 33.1587 48.7396C33.7583 46.3914 33.7583 41.2254 43.3522 25.2578Z"
        fill={GREEN}
      />
    </svg>
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
        padding: "64px 72px",
        color: "white",
        backgroundColor: "#0b0f0c",
        backgroundImage: `radial-gradient(circle at 100% 0%, rgba(74, 222, 128, 0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(34, 211, 238, 0.12), transparent 45%)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Logo size={56} />
        <p
          style={{
            fontSize: "40px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          Yeecord
        </p>
      </div>

      <p
        style={{
          fontSize: "76px",
          fontWeight: 800,
          lineHeight: 1.25,
          margin: 0,
          marginTop: "auto",
          lineClamp: 2,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: "34px",
            lineHeight: 1.6,
            color: "rgba(235, 245, 238, 0.72)",
            margin: 0,
            marginTop: "24px",
            lineClamp: 2,
          }}
        >
          {description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "48px",
        }}
      >
        <p
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: GREEN,
            margin: 0,
          }}
        >
          yeecord.com
        </p>
        <div
          style={{
            display: "flex",
            width: "280px",
            height: "10px",
            borderRadius: "5px",
            backgroundImage: `linear-gradient(to right, ${GREEN}, ${CYAN})`,
          }}
        />
      </div>
    </div>
  );
}
