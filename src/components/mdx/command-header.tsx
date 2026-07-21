import { Bot, MapPin, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const labels = {
  tw: {
    you: "誰能用",
    bot: "機器龍需要",
    where: "可以用在",
    everyone: "任何成員",
    basic: "基本權限就夠",
    server: "伺服器",
    dm: "私訊",
    groupDm: "群組私訊",
    hint: "機器龍權限不足？看",
    hintLink: "權限說明",
    basicsUrl: "/zh-tw/docs/basics/#機器龍的權限怎麼改",
  },
  cn: {
    you: "谁能用",
    bot: "机器龙需要",
    where: "可以用在",
    everyone: "任何成员",
    basic: "基本权限就够",
    server: "服务器",
    dm: "私信",
    groupDm: "群组私信",
    hint: "机器龙权限不足？看",
    hintLink: "权限说明",
    basicsUrl: "/zh-cn/docs/basics/#机器龙的权限怎么改",
  },
};

function Row({ icon, label, items }: { icon: ReactNode; label: string; items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
      <span className="flex w-28 shrink-0 items-center gap-2 text-fd-muted-foreground [&_svg]:size-4">
        {icon}
        {label}
      </span>
      <span className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border px-2 py-0.5 text-xs text-fd-foreground"
          >
            {item}
          </span>
        ))}
      </span>
    </div>
  );
}

export function createCommandHeader(locale: "tw" | "cn") {
  const t = labels[locale];

  return function CommandHeader({
    you = [],
    bot = [],
    anywhere,
  }: {
    you?: string[];
    bot?: string[];
    anywhere?: boolean;
  }) {
    return (
      <div className="not-prose my-4 divide-y rounded-xl border bg-fd-card text-sm">
        <Row
          icon={<UserRound />}
          label={t.you}
          items={you.length ? you : [t.everyone]}
        />
        <Row
          icon={<Bot />}
          label={t.bot}
          items={bot.length ? bot : [t.basic]}
        />
        <Row
          icon={<MapPin />}
          label={t.where}
          items={anywhere ? [t.server, t.dm, t.groupDm] : [t.server]}
        />
        <p className="px-4 py-2 text-xs text-fd-muted-foreground">
          {t.hint} <a href={t.basicsUrl}>{t.hintLink}</a>
        </p>
      </div>
    );
  };
}
