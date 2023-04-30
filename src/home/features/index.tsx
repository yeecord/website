import { ChineseUI } from "./ChineseUI";
import { Dashboard } from "./Dashboard";
import { Music } from "./Music";
import { Games } from "./Games";
import clsx from "clsx";

export function Features() {
  return (
    <>
      <div className="mt-[10rem] flex flex-col gap-10 text-center sm:mt-[15rem]">
        <p
          className={clsx(
            "mx-auto w-fit bg-gradient-to-br from-orange-400 to-red-500 py-2 px-4 font-semibold text-white",
            "text-3xl sm:text-4xl",
          )}
        >
          功能強大
        </p>
        <h1 className="font-yahei text-5xl font-bold sm:text-5xl lg:text-6xl">
          您需要的功能都&#8288;在&#8288;這&#8288;裡
        </h1>
        <h2 className="mx-auto max-w-2xl text-xl text-secondary-light dark:text-secondary-dark">
          從伺服器管理、歡迎消息到音樂播放器和角色扮演系統
          <br />
          我們為您的伺服器提供強大的功能
        </h2>
      </div>
      <ChineseUI />
      <Games />
      <Music />
      <Dashboard />
    </>
  );
}
