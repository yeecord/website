import { MessageSquarePlusIcon } from "lucide-react";
import type { ReactNode } from "react";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

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
