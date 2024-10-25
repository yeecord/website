import { GithubIcon, MessageSquarePlusIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function Sponsor() {
  return (
    <div className="mt-20 flex flex-col items-center gap-3 bg-gradient-to-b from-secondary/50 px-4 py-40 text-center">
      <p className="text-lg text-purple-400 tracking-widest">
        喜歡YEE式機器龍?
      </p>
      <h2 className="font-bold text-5xl">支持我們</h2>
      <p className="text-lg text-muted-foreground sm:text-xl">
        照顧機器龍是一項艱鉅的工作
        <span className="max-sm:hidden">, </span>
        <br className="sm:hidden" />
        以實際行動支持我們吧
      </p>

      <div className="mt-5 grid w-full max-w-[60rem] grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          title="照顧機器龍"
          text="在 Github 上貢獻"
          icon={<GithubIcon />}
          href="https://github.com/yeecord/website"
        >
          貢獻
        </Card>
        <Card
          title="給予反饋"
          text="在 Discord 回饋資訊給我們"
          icon={<MessageSquarePlusIcon />}
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
      <div className="flex flex-row gap-2.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-400 text-white dark:bg-purple-500">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-muted-foreground text-sm">{text}</p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-7 block w-full rounded-md bg-purple-500 py-2 text-center font-medium text-sm text-white shadow-lg shadow-purple-300 sm:w-[8rem] dark:bg-purple-500 dark:shadow-purple-700"
      >
        {children}
      </a>
    </div>
  );
}
