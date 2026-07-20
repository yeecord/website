import { domain, footer } from "@config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "@/components/Footer";
import { Community } from "@/home/Community";
import { Customers } from "@/home/Customers";
import { Features } from "@/home/features";
import { Hero } from "@/home/Hero";
import { RpgSystem } from "@/home/RpgSystem";
import Sponsor from "@/home/Sponsor";
import { baseOptions } from "@/layout-config";

const TITLE = "Yeecord - 萬中選一的 Discord 機器人";
const DESCRIPTION =
  "YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間";

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions}>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={domain} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content="/opengraph-image.png" />
      <main className="overflow-x-clip">
        <div className="mx-auto flex max-w-[1400px] flex-col px-3 md:px-6">
          <Hero />
          <Features />
          <RpgSystem />
          <Customers />
        </div>
        <Sponsor />
        <Community />
      </main>
      <Footer categories={footer} />
    </HomeLayout>
  );
}

export function getConfig() {
  return {
    render: "static",
  } as const;
}
