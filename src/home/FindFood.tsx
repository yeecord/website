"use client";

const GreenGradient = "/home/green-gradient.svg";
import clsx from "clsx";
import { motion } from "framer-motion";
import Gradient from "./components/Gradient";

export function FindFood() {
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
            "mx-auto w-fit rounded-md bg-gradient-to-br from-green-400 to-green-600 px-6 py-2 font-semibold text-white text-xl sm:text-3xl",
          )}
        >
          放置型小遊戲
        </p>
        <h2 className="font-bold text-5xl sm:text-5xl lg:text-6xl">
          陪 Yee <span className="whitespace-nowrap">出門找吃的</span>
        </h2>
        <h3 className="mx-auto max-w-2xl text-muted-foreground text-xl">
          出門覓食、下鍋烹飪、餵牠養感情，全按鈕操作，不用背任何指令。
        </h3>
      </div>
      <Background />
      <motion.div
        whileInView={{ y: 0, opacity: 1 }}
        initial={{ y: "5rem", opacity: 0 }}
      >
        <Plays />
      </motion.div>
    </div>
  );
}

function Background() {
  return (
    <Gradient
      src={GreenGradient}
      className="-bottom-[100px] -z-[1] lg:-bottom-[40%] absolute w-full min-w-[800px] opacity-80"
    />
  );
}

function Plays() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-3 text-start md:grid-cols-2 lg:grid-cols-3">
      <Play
        name="覓食"
        description="選個地點帶 Yee 出門，袋子隨時間慢慢裝滿，收成時揭曉這趟撿到什麼"
      />
      <Play
        name="烹飪"
        description="從背包挑幾樣食材下鍋，Yee 會評分，從能吃的普通料理到完美的絕品都有"
      />
      <Play
        name="黑暗料理"
        description="搭配得太離譜就會煮出黑暗料理，不過牠們有自己的隱藏菜譜可以收集"
      />
      <Play
        name="菜譜"
        description="記錄你煮出過的所有料理，收集控的天堂"
        optional
      />
      <Play
        name="餵牠"
        description="把料理餵給 Yee 培養感情，感情越好互動越多"
        optional
      />
      <Play
        name="今日想吃"
        description="每天一個風味提示，只給方向不給答案，照著煮容易拿高分"
        optional
      />
    </div>
  );
}

function Play({
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
      <p className="font-medium text-lg">{name}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
