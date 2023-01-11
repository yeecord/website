import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import { LinkButton } from "@components/LinkButton";
import clsx from "clsx";
import { formatter } from "../../src/config";

export function Customers({ usedBy }: { usedBy: number }) {
    return (
        <div className="relative flex flex-col gap-5 z-[2] mt-[10rem] items-center text-center">
            <h1 className="heading-xl">
                受超過
                <span className="block max-md:text-7xl md:inline text-gradient from-pink-600 to-orange-400 mx-2">
                    {formatter.format(usedBy)}
                </span>
                個伺服器使用
            </h1>
            <h3 className="heading-md text-secondary">你也可以加入我們</h3>
            <div className="h-stack">
                <LinkButton
                    href="/invite"
                    className="secondary-button shadow-lg backdrop-blur-lg"
                >
                    邀請機器人
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
