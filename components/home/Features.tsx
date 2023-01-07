import clsx from "clsx";
import { ReactNode } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { BsStarFill, BsTranslate } from "react-icons/bs";

export function Features() {
  return (
    <div
      className={clsx(
        "mt-[2rem] lg:mt-[5rem] z-[2]",
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      )}
    >
      <Feature
        icon={<BsTranslate />}
        title="全中文化界面"
        description="我們提供了全中文化的界面，讓不懂英文的各位也有好用的機器人"
      />
      <Feature
        icon={<BsStarFill />}
        title="不只是聊天平台"
        description="透過機器人各種有趣的系統，讓你的Discord更加有趣，同時朋友也可以和你一起玩"
      />
      <Feature
        icon={<AiFillDashboard />}
        title="用戶友好的儀表板"
        description="通過美觀、用戶友好的儀表板管理你的機器人"
      />
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card">
      <div className="h-stack">
        <div className="p-2 bg-pink-500 rounded-md text-white">{icon}</div>

        <h3 className="heading-md">{title}</h3>
      </div>
      <div className="pt-2">
        <p className="text-secondary dark:text-secondary-dark">{description}</p>
      </div>
    </div>
  );
}
