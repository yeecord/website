import { IoMdOpen } from "react-icons/io";
import { Gradient } from "@components/Gradient";
import HeroGradient from "@static/hero.svg";
import Image from "next/image";
import { LinkButton } from "@components/LinkButton";
import clsx from "clsx";

function Buttons() {
  return (
    <div className="grid grid-cols-1 w-full max-w-[400px] sm:w-fit sm:grid-cols-2 gap-3">
      <LinkButton href="/docs" className="primary-button rounded-md w-full">
        開始使用
      </LinkButton>
      <LinkButton
        href="/invite"
        target="_blank"
        className="icon-button rounded-md w-full justify-center"
      >
        <IoMdOpen />
        <p>邀請機器人</p>
      </LinkButton>
    </div>
  );
}

export function Hero() {
  return (
    <div
      className={clsx(
        "w-full flex flex-col gap-12 relative z-[2] mt-[8rem] md:mt-[12rem] xl:mt-[15rem] px-[1rem]",
        "items-center text-center"
      )}
    >
      <Gradient
        src={HeroGradient}
        className="absolute hidden -top-[200px] -right-0 lg:-right-[300px] min-w-[800px] w-full -z-[1]"
      />
      <h1 className="text-6xl font-[700] sm:text-7xl leading-[1.1] md:text-6xl lg:text-7xl">
        最強大的
        <br className="md:hidden" />
        <span className="text-gradient bg-gradient-to-r from-blue-400 to-green-300">
          Discord
        </span>
        <br className="md:hidden" />
        機器人
      </h1>
      <h2 className="heading-md md:text-3xl text-secondary-light dark:text-secondary-dark max-w-[450px] md:max-w-[700px]">
        Yeecord是一個具有眾多功能且強大的中文Discord機器人，讓你創造出優秀的中文服務器
      </h2>
      <Buttons />
      <Servers />
    </div>
  );
}

function Servers() {
  return (
    <div className="flex flex-col gap-5 mt-[3rem]">
      <p className="text-lg font-semibold text-secondary mb-3">
        各大伺服器一致好評
      </p>
      <div
        className={clsx(
          "flex flex-row justify-center gap-x-6 gap-y-3",
          "overflow-hidden md:flex-wrap",
          "mask-image-[linear-gradient(to_right,_transparent,_white,_transparent)] md:mask-image-[none]"
        )}
      >
        <Server img="/home/customers/apex-tw.png" name="APEX Taiwan" />
        <Server img="/home/customers/avery.png" name="Avery" transparent />
        <Server img="/home/customers/chengfeng.png" name="承風飛躍" />
        <div className="hidden sm:block basis-full" />
        <Server
          img="/home/customers/daidai.png"
          name="老查呆呆の迷因調查局總部"
        />
        <Server img="/home/customers/empressival.png" name="Empressival" />
        <Server img="/home/customers/myit.png" name="MyIT" />
        <Server img="/home/customers/valorant-tw.png" name="VALORANT Taiwan" />
      </div>
    </div>
  );
}

function Server({
  img,
  name,
  transparent,
}: {
  img: string;
  name: string;
  transparent?: boolean;
}) {
  return (
    <div className="h-stack gap-2 text-gray-700 dark:text-gray-300 flex-shrink-0">
      <Image
        alt={name}
        src={img}
        width="50"
        height="50"
        className={clsx(
          "rounded-full grayscale",
          transparent && "brightness-[10%] dark:brightness-75"
        )}
      />
      <h3 className="heading-md hidden sm:block">{name}</h3>
    </div>
  );
}
