import clsx from "clsx";
import { type ReactNode } from "react";
import { RiFeedbackFill, RiGithubFill } from "react-icons/ri";

export default function Sponsor() {
  return (
    <div
      className={clsx(
        "mt-[5rem] bg-white p-4 py-[6rem] dark:bg-zinc-900/50",
        "flex w-full flex-col items-center gap-3 text-center",
        "font-semibold",
      )}
    >
      <p className="text-lg tracking-widest text-purple-400">
        喜歡YEE式機器龍?
      </p>
      <h1 className="text-5xl font-bold">支持我們</h1>
      <p className="text-lg font-bold text-secondary-light dark:text-secondary-dark sm:text-xl">
        照顧機器龍是一項艱鉅的工作
        <span className="max-sm:hidden">, </span>
        <br className="sm:hidden" />
        以實際行動支持我們吧
      </p>

      <div className="mt-5 grid w-full max-w-[60rem] grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          title="照顧機器龍"
          text="在 Github 上貢獻"
          icon={<RiGithubFill />}
          href="https://github.com/yeecord/website"
        >
          貢獻
        </Card>
        <Card
          title="給予反饋"
          text="在 Discord 回饋資訊給我們"
          icon={<RiFeedbackFill />}
          href="https://discord.gg/yeecord"
        >
          加入群組
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  text,
  icon,
  children,
  href,
}: {
  title: string;
  text: string;
  icon: ReactNode;
  children: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border-[1px] border-black/10 bg-white/40 p-4 text-start shadow-lg dark:border-white/10 dark:bg-white/10">
      <div className="h-stack">
        <div className="rounded-md bg-purple-400 p-3 text-2xl text-white dark:bg-purple-500">
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold sm:text-xl">{title}</p>
          <p className="text-secondary-light dark:text-secondary-dark">
            {text}
          </p>
        </div>
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        <button
          className={clsx(
            "text-md mt-6 w-[8rem] rounded-xl py-1 font-bold text-white shadow-lg",
            "bg-purple-400 shadow-purple-300",
            "dark:bg-purple-500 dark:shadow-purple-700",
          )}
        >
          {children}
        </button>
      </a>
    </div>
  );
}
