import Link from "fumadocs-core/link";
import { contentPath, type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { Booth, type Customer } from "./stall/Booth";

const SERVERS: Customer[] = [
  { img: "/home/customers/apex-tw.png", name: "APEX Taiwan" },
  { img: "/home/customers/valorant-tw.png", name: "VALORANT Taiwan" },
  { img: "/home/customers/avery.png", name: "Avery" },
  { img: "/home/customers/zeitfrei.png", name: "ZeitFrei" },
  { img: "/home/customers/daptor.png", name: "有感筆電軍團 - Daptor Army" },
  { img: "/home/customers/empressival.png", name: "Empressival" },
  { img: "/home/customers/daidai.png", name: "老查呆呆の迷因調查局總部" },
];

export function Hero({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="flex flex-col gap-8 pt-12 sm:pt-16">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="font-extrabold text-[2.5rem] leading-[1.15] tracking-tight sm:text-6xl">
            {t("伺服器的雜事，")}
            <br />
            {t("恐龍包了")}
          </h1>
          <p className="max-w-136 text-pretty text-lg text-muted-foreground">
            {t("發身分組、辦抽獎、開語音房，介面全中文，免費使用")}
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Link href={`${staticPath(locale, "/install")}/`} className="btn-chunky">
            {t("安裝機器人")}
          </Link>
          <Link
            href={contentPath(locale, "/docs")}
            className="btn-chunky-secondary"
          >
            {t("看使用教學")}
          </Link>
        </div>
      </div>
      <Booth
        locale={locale}
        customers={SERVERS}
        proof={
          <>
            {t("APEX Taiwan、VALORANT Taiwan 等")}
            <strong>350,000+</strong>
            {t("個伺服器都在用")}
          </>
        }
      />
    </div>
  );
}
