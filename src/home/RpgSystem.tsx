"use client";

import Gradient from "./components/Gradient";
import GreenGradient from "@static/home/green-gradient.svg";
import clsx from "clsx";
import { motion } from "framer-motion";

export function RpgSystem() {
  return (
    <div
      className={clsx(
        "relative flex flex-col items-center gap-5 text-center",
        "z-[2] mt-[15rem]",
      )}
    >
      <div className="flex flex-col gap-10">
        <p
          className={clsx(
            "mx-auto w-fit rounded-md bg-gradient-to-br from-green-400 to-green-600 px-6 py-2 text-xl font-semibold text-white sm:text-3xl",
          )}
        >
          冒險模式
        </p>
        <h1 className="text-5xl font-bold sm:text-5xl lg:text-6xl">
          開創性的<span className="whitespace-nowrap">角色扮演系統</span>
        </h1>
        <h2 className="mx-auto max-w-2xl text-xl text-muted-foreground">
          進入這個奇幻世界，開始你的冒險吧！
        </h2>
      </div>
      <Background />
      <motion.div
        whileInView={{ y: 0, opacity: 1 }}
        initial={{ y: "5rem", opacity: 0 }}
      >
        <Jobs />
      </motion.div>
    </div>
  );
}

function Background() {
  return (
    <Gradient
      src={GreenGradient}
      className="absolute -bottom-[100px] -z-[1] w-full min-w-[800px] opacity-80 lg:-bottom-[40%]"
    />
  );
}

function Jobs() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-3 text-start md:grid-cols-2 lg:grid-cols-3">
      <Job
        name="農夫"
        description="和漁夫是差不多辛勤的職業，不過在這個世界，農夫的收益比漁夫還要高"
      />
      <Job
        name="漁夫"
        description="是個需要勞力的職業，你必須要努力勤奮的抓魚，才會獲得收益"
      />
      <Job
        name="藥劑師"
        description="是受一般人敬仰的職業，透過進行科學實驗生產藥水，能夠獲得很高的收益"
      />
      <Job
        name="廚師"
        description="跟農夫以及漁夫購買食材，再透過烘烤食物並轉賣來獲得收益"
        optional
      />
      <Job
        name="礦工"
        description="在深不見底的洞窟裡挖礦，雖然可能沒有很好的收穫，不過有機會也可以挖到鑽石等好東西"
      />
      <Job
        name="牧農"
        description="飼養各類的禽類豬雞牛等還獲得肉類"
        optional
      />
      <Job
        name="鐵匠"
        description="通常會和礦工合作來熔煉礦物並販賣出很高的價錢"
        optional
      />
      <Job
        name="伐木工"
        description="在森林中砍伐木頭，是木頭的來源"
        optional
      />
    </div>
  );
}

function Job({
  name,
  description,
  optional,
}: {
  name: string;
  description: string;
  optional?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-xl border bg-background/50 bg-gradient-to-b from-secondary p-4 text-secondary-foreground shadow-lg backdrop-blur-3xl",
        optional && "max-md:hidden",
      )}
    >
      <p className="text-lg font-medium">{name}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
