import { canonicalUrl, domain, footer, footerCn } from "@config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { LanguagesIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { Community } from "@/home/Community";
import { DemoServer } from "@/home/DemoServer";
import { Hero } from "@/home/Hero";
import { Trust } from "@/home/Trust";
import { baseOptions, cnBaseOptions } from "@/layout-config";
import { homeCopy } from "./copy";

export function HomePage({ locale }: { locale: keyof typeof homeCopy }) {
  const cn = locale === "zh-cn";
  const copy = homeCopy[locale];
  const options = cn ? cnBaseOptions : baseOptions;

  return (
    <HomeLayout
      {...options}
      // the built-in switch only prepends a locale prefix, which sends the
      // prefix-less home to a nonexistent /zh-tw
      slots={{ languageSelect: false }}
      links={[
        ...options.links,
        {
          type: "icon",
          url: cn ? "/" : "/zh-cn/",
          text: cn ? "繁體中文" : "简体中文",
          icon: <LanguagesIcon />,
        },
      ]}
    >
      <title>{copy.meta.title}</title>
      <meta name="description" content={copy.meta.description} />
      <link rel="canonical" href={canonicalUrl(cn ? "/zh-cn" : "/")} />
      <link rel="alternate" hrefLang="zh-Hant" href={canonicalUrl("/")} />
      <link rel="alternate" hrefLang="zh-Hans" href={canonicalUrl("/zh-cn")} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl("/")} />
      <meta property="og:title" content={copy.meta.title} />
      <meta property="og:description" content={copy.meta.description} />
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
      <main className="overflow-x-clip">
        <Hero copy={copy} />
        <div className="mx-auto flex max-w-[1100px] flex-col px-3 md:px-6">
          <DemoServer copy={copy} />
          <Trust copy={copy} />
        </div>
        <Community copy={copy} />
      </main>
      <Footer categories={cn ? footerCn : footer} brand={copy.hero.mascotAlt} />
    </HomeLayout>
  );
}
