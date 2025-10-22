import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ImageResponse } from "next/og";
import { docs } from "../../../source";
import { notFound } from "next/navigation";

const noto = await readFile(
  resolve(process.cwd(), "./public/noto-sans-semi-bold.woff"),
);

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;

  const page = docs.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <div
      tw="flex h-full w-full p-12"
      style={{ background: "hsl(0 0% 3.9%)", color: "hsl(0 0% 98%)" }}
    >
      <div
        tw="flex flex-col items-center text-center justify-center w-full h-full p-20 rounded-2xl border border-gray-900"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))",
        }}
      >
        {/* biome-ignore lint: satori */}
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          fill="none"
          style={{ marginBottom: "1rem" }}
        >
          <path
            d="M43.3522 25.2578C52.946 9.29013 72.5335 4.51549 81.128 4.12413C85.15 3.46785 94.7859 5.5398 99 7.38145C103.214 9.22311 107.699 10.3815 114.5 18.8815C121.301 27.3815 123 41.8815 123 51.8815C123 61.8815 118.222 77.4108 109.31 84.5494C107.413 86.0689 103.482 87.3457 98.5168 88.4495V115.881C98.5168 120.3 94.9351 123.881 90.5168 123.881H57.3483C52.9301 123.881 49.3483 120.3 49.3483 115.881V94.9799C35.5571 94.9799 23.5649 92.768 17.5687 89.8328C11.5725 86.8976 1.97863 78.6789 4.37712 65.1769C6.85518 51.2269 23.5648 46.9785 33.1587 48.7396C33.7583 46.3914 33.7583 41.2254 43.3522 25.2578Z"
            fill="hsl(0 0% 98%)"
          />
        </svg>
        <p tw="text-white font-bold text-6xl">{page.data.title}</p>
        <p tw="text-2xl" style={{ color: "hsl(0 0% 63.9%)" }}>
          {page.data.description}
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans TC",
          data: noto,
        },
      ],
    },
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return docs.getPages().map(page => ({
    locale: page.locale,
    slug: [...page.slugs, 'image.png']
  }));
}
