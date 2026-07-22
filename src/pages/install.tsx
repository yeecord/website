import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "@/components/Footer";
import { canonicalUrl, domain, footer } from "@config";
import { InvitePicker } from "@/components/invite/picker";
import { Cloud, GroundBand, Plant } from "@/home/scene";
import { baseOptions } from "@/layout-config";

const TITLE = "安裝 YEE 式機器龍";
const DESCRIPTION =
  "權限自己勾，勾多少拿多少。也可以裝到自己的帳號上，私訊和任何伺服器都能用。";

export default function InstallPage() {
  return (
    <HomeLayout {...baseOptions}>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={canonicalUrl("/install")} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
      <main className="overflow-x-clip">
        <div className="relative mx-auto w-full max-w-4xl px-4 pt-20 pb-24">
          <Cloud n={1} width={150} className="top-6 left-[1%] max-sm:w-20" />
          <Cloud
            n={3}
            width={190}
            className="top-2 right-[1%] [animation-delay:-9s] max-sm:w-24"
          />
          <div className="mb-6 flex items-center justify-center gap-4">
            <img
              src="/img/logo.svg"
              alt="YEE 式機器龍"
              width={64}
              height={64}
              className="animate-[bob_5s_ease-in-out_infinite] drop-shadow-lg motion-reduce:animate-none"
            />
            <span className="text-2xl text-fd-muted-foreground tracking-[0.4em]">
              ⋯
            </span>
            <span className="flex size-16 items-center justify-center rounded-full bg-discord-blurple">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="size-9"
                aria-label="Discord"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </span>
          </div>
          <h1 className="text-center font-bold text-4xl tracking-tight sm:text-5xl">
            快來把我<span className="text-primary">帶回家</span>！
          </h1>
          <p className="mx-auto mt-4 mb-10 max-w-md text-center text-fd-muted-foreground text-lg">
            權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。
          </p>
          <InvitePicker />
        </div>
        <GroundBand className="h-28">
          <Plant
            src="treeSmall_green2"
            height={48}
            className="top-6 left-[10%]"
          />
          <Plant
            src="bush1"
            height={38}
            className="top-9 right-[13%] [animation-delay:-2.4s]"
          />
        </GroundBand>
      </main>
      <Footer categories={footer} />
    </HomeLayout>
  );
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
