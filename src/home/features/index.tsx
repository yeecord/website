import { ChineseUI } from "./ChineseUI";
import { Dashboard } from "./Dashboard";
import { Music } from "./Music";
import { Games } from "./Games";

export function Features() {
  return (
    <>
      <div className="mt-[10rem] flex flex-col gap-5 text-center sm:mt-[15rem]">
        <h1 className="font-yahei text-5xl font-bold leading-snug sm:text-5xl lg:text-6xl">
          <p className="text-gradient from-orange-400 to-red-500 text-3xl font-semibold sm:text-4xl">
            功能強大
          </p>
          <p className="my-6">您需要的功能都&#8288;在&#8288;這&#8288;裡</p>
        </h1>
        <h2 className="mx-auto max-w-2xl text-xl text-secondary-light dark:text-secondary-dark">
          從伺服器管理、歡迎消息到音樂播放器和角色扮演系統，我們為您的伺服器提供強大的功能
        </h2>
      </div>
      <ChineseUI />
      <Games />
      <Music />
      <Dashboard />
    </>
  );
}
