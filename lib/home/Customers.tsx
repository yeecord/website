import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import LinkButton from "./components/LinkButton";
import clsx from "clsx";
import { animate, motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import formatter from "../../lib/utils/formatter";

export function Customers({ usedBy }: { usedBy: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref);
    const count = useAnimatedCounter(
        usedBy,
        Math.max(usedBy - 10000, 0),
        1,
        isInView
    );

    return (
        <motion.div
            className="relative flex flex-col gap-5 z-[2] mt-[10rem] items-center text-center"
            ref={ref}
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="heading-xl">
                受超過
                <span className="block max-md:text-7xl md:inline text-gradient from-pink-600 to-orange-400 mx-2">
                    {formatter.format(Math.floor(count))}
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
        </motion.div>
    );
}

export const useAnimatedCounter = (
    maxValue: number,
    initialValue = 0,
    duration = 1,
    enabled: boolean
) => {
    const [counter, setCounter] = useState<number>(initialValue);

    useEffect(() => {
        if (!enabled) {
            setCounter(initialValue);
            return;
        }

        const controls = animate(initialValue, maxValue, {
            duration,
            onUpdate(value) {
                setCounter(value);
            },
        });
        return () => controls.stop();
    }, [initialValue, maxValue, duration, enabled]);

    return counter;
};
