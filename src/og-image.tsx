import logoSvg from "../public/img/logo.svg?raw";

const GREEN = "#6bb369";

function Logo({ size }: { size: number }) {
  return <img src={logoSvg} width={size} height={size} />;
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
        flexDirection: "row",
        width: "100%",
        height: "100%",
        backgroundColor: "#111411",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "24px",
          height: "100%",
          backgroundColor: GREEN,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "60px 72px",
        }}
      >
        <p
          style={{
            fontSize: "80px",
            fontWeight: 800,
            lineHeight: 1.25,
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
              lineHeight: 1.6,
              color: "#a7b0aa",
              margin: 0,
              marginTop: "28px",
              lineClamp: 2,
              textOverflow: "ellipsis",
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
            gap: "20px",
            marginTop: "auto",
          }}
        >
          <Logo size={52} />
          <p
            style={{
              fontSize: "36px",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Yeecord
          </p>
        </div>
      </div>
    </div>
  );
}
