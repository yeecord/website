import { ReactElement } from "react";
import { IoMdSend } from "react-icons/io";
import { Gradient } from "@components/Gradient";
import PinkGradient from "@static/home/pink-gradient.svg";
import Image from "next/image";
import clsx from "clsx";
import { LinkButton } from "@components/LinkButton";
import { ReactNode } from "react";
import { AiFillDashboard } from "react-icons/ai";
import {
  BsChatFill,
  BsStarFill,
  BsTerminalFill,
  BsTranslate,
} from "react-icons/bs";

export function Powerful() {
  return (
    <div className="relative mt-[10rem] flex flex-col gap-5 z-[2]">
      <Gradient
        src={PinkGradient}
        className={clsx(
          "absolute -z-[1] -top-[10%] -left-[20%] w-full min-w-[800px] ",
          "lg:max-h-[1100px] lg:-top-[30%]"
        )}
      />
      <h1 className="heading-xl">
        您需要的
        <br className="sm:hidden" />
        <span className="text-gradient from-orange-400 to-red-500">
          所有功能
        </span>
        都在這裡
      </h1>
      <h2 className="heading-md text-secondary text-medium">
        從伺服器管理、歡迎消息到音樂播放器和角色扮演系統，我們為您的伺服器提供強大的功能
      </h2>
      <div className="h-stack">
        <LinkButton
          href="/docs"
          className="primary-button bg-gradient-to-br from-orange-500 to-red-600 rounded-xl font-medium"
        >
          了解更多
        </LinkButton>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.5fr] gap-3">
        <Chat />
        <Features />
      </div>
    </div>
  );
}

export function Features() {
  return (
    <div className="z-[2] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4">
      <Feature
        icon={<BsTranslate />}
        title="全中文化界面"
        description="我們提供了全中文化的界面，讓不懂英文的各位也有好用的機器人"
      />
      <Feature
        icon={<BsStarFill />}
        title="不只是聊天平台"
        description="透過機器人各種有趣的系統，讓你的 Discord 更加有趣，同時朋友也可以和你一起玩"
      />
      <Feature
        icon={<AiFillDashboard />}
        title="簡易的控制面板"
        description="通過美觀、簡易的方式來自定義你的機器人"
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
        <div className="p-2 bg-blue-500 rounded-md text-white">{icon}</div>

        <h3 className="heading-md">{title}</h3>
      </div>
      <div className="pt-2">
        <p className="text-secondary dark:text-secondary-dark">{description}</p>
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div
      className={clsx(
        "card max-w-[800px] mt-2 bg-white/10 dark:bg-black/10 p-2 md:p-3 h-fit",
        "grid grid-cols-1 sm:grid-cols-[0.5fr_1fr] gap-4"
      )}
    >
      <div
        className={clsx(
          "flex-col gap-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg",
          "hidden sm:flex"
        )}
      >
        <div
          className={clsx(
            "h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl",
            "flex flex-col text-6xl text-white items-center justify-center mb-2"
          )}
        >
          <BsTerminalFill />
        </div>
        <Channel name="一般" active />
        <Channel name="指令" />
      </div>

      <div className="flex flex-col gap-3">
        <Message user="Money">
          <p className="text-secondary dark:text-secondary-dark font-medium">
            /發送公告
          </p>
        </Message>
        <Message user="YEE式機器龍" avatar="/img/logo_128x128.png">
          <div className="card p-2 shadow-none">
            <span className="text-black dark:text-white font-medium">
              你也可以叫我阿龍，<br/>但是記得不要把我煮來吃
            </span>
          </div>
        </Message>
        <ChatInput />
      </div>
    </div>
  );
}

function ChatInput() {
  return (
    <div className="h-stack px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-xl">
      <input
        className="w-full bg-transparent normal-input"
        placeholder="傳送訊息到 #一般"
      />
      <button
        className="rounded-full p-3 bg-blue-500 text-white"
        aria-label="傳送訊息"
      >
        <IoMdSend />
      </button>
    </div>
  );
}

function Message({
  user,
  avatar,
  children,
}: {
  user: string;
  avatar?: string;
  children: ReactElement;
}) {
  return (
    <div className="h-stack items-start gap-3 bg-gray-100 dark:bg-gray-900 p-3 rounded-xl shadow-xl">
      {avatar != null ? (
        <Image
          alt="avatar"
          src={avatar}
          width="36"
          height="36"
          className="w-12 h-12 rounded-full mt-1"
        />
      ) : (
        <div
          className="rounded-full w-12 h-12 flex flex-col items-center justify-center mt-1 text-lg text-white bg-gradient-to-br from-blue-500 to-blue-900"
        >
          {user.charAt(0)}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h3 className="heading">{user}</h3>
        {children}
      </div>
    </div>
  );
}

function Channel({ name, active }: { name: string; active?: boolean }) {
  return (
    <div
      className={clsx(
        "p-3 rounded-xl flex flex-row gap-2 items-center font-medium",
        active ? "bg-blue-600" : "bg-white dark:bg-gray-800",
        active ? "text-white" : "text-secondary"
      )}
    >
      <BsChatFill className="text-lg" />
      <h3 className="text-lg">{name}</h3>
    </div>
  );
}
