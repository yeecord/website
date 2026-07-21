import { canonicalUrl, domain, footer } from "@config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "@/components/Footer";
import { Community } from "@/home/Community";
import { DemoServer } from "@/home/DemoServer";
import { Hero } from "@/home/Hero";
import { Trust } from "@/home/Trust";
import { baseOptions } from "@/layout-config";

const TITLE = "Yeecord - 萬中選一的 Discord 機器人";
const DESCRIPTION =
  "YEE 式機器龍是全中文的 Discord 機器人：抽獎、身分組、動態語音、找吃的小遊戲通通都有，25 萬個伺服器都在用";

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions}>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={canonicalUrl("/")} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
      <main className="overflow-x-clip">
        <Hero />
        <div className="mx-auto flex max-w-[1100px] flex-col px-3 md:px-6">
          <DemoServer />
          <Trust />
        </div>
        <Community />
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
