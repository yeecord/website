import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import { LinkButton } from "@components/LinkButton";
import clsx from "clsx";

export function Customers({ usedBy }: { usedBy: number }) {
  return (
    <div className="relative flex flex-col gap-5 z-[2] mt-[10rem] items-center text-center">
      <h1 className="heading-xl">
        受超過
        <span className="block text-7xl md:text-5xl md:inline text-gradient from-pink-600 to-orange-400">
          {usedBy}
          <span className="md:text-black md:dark:text-white">個</span>
        </span>
        服務器使用
      </h1>
      <h3 className="heading-md text-secondary">你可以成為他們的一部分</h3>
      <div className="h-stack">
        <LinkButton
          href="/invite"
          className="secondary-button shadow-lg backdrop-blur-lg"
        >
          開始使用
        </LinkButton>
      </div>
      <Image
        className={clsx(
          "w-full -z-[1] -mt-[200px] md:-mt-[100px] h-[300px] object-cover custom",
          "mask-image-[linear-gradient(to_right,_transparent,white_10%,white_70%,_transparent)]"
        )}
        alt="wave"
        src={PinkWave}
      />
    </div>
  );
}
