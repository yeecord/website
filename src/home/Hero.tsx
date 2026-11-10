import { contentPath, type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { NeonTitle } from "./NeonTitle";
import { Sky } from "./stall/Sky";
import { type Customer, Street } from "./stall/Street";

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
    <div className="night">
      <Sky />
      <div className="relative flex flex-col items-center gap-3 px-4 pt-16 text-center">
        <NeonTitle lines={[t("伺服器的雜事，"), t("恐龍包了")]} />
        <p className="max-w-136 text-pretty text-[#e7dbbe] text-base sm:text-lg">
          {t("發身分組、辦抽獎、開語音房，介面全中文，免費使用")}
        </p>
      </div>
      <Street
        locale={locale}
        install={{
          href: `${staticPath(locale, "/install")}/`,
          label: t("安裝機器人"),
        }}
        docs={{ href: contentPath(locale, "/docs"), label: t("看使用教學") }}
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
