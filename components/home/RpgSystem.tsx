import Gradient from "./internal/Gradient";
import LinkButton from "./internal/LinkButton";
import GreenGradient from "@static/home/green-gradient.svg";
import clsx from "clsx";
import { motion } from "framer-motion";

export function RpgSystem() {
    return (
        <motion.div
            className={clsx(
                "flex flex-col relative gap-5 items-start md:items-center",
                "mt-[15rem] z-[2]"
            )}
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "5rem", opacity: 0 }}
        >
            <Background />

            <h1 className="heading-xl">
                <span className="text-gradient from-green-400 to-blue-400 dark:to-blue-200">
                    開創性
                </span>
                的角色扮演系統
            </h1>
            <h3 className="heading-md text-secondary">
                進入這個奇幻世界，開始你的冒險吧！
            </h3>
            <LinkButton
                href="/docs/rpg"
                className="primary-button mt-4 bg-gradient-to-b from-green-400 to-green-600"
            >
                開始使用
            </LinkButton>
            <Jobs />
        </motion.div>
    );
}

function Background() {
    return (
        <Gradient
            src={GreenGradient}
            className="absolute -bottom-[100px] lg:-bottom-[40%] opacity-80 w-full min-w-[800px] -z-[1]"
        />
    );
}

function Jobs() {
    return (
        <div className="grid text-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-3">
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
                "card flex flex-col gap-3 backdrop-blur-3xl bg-white/70 dark:bg-[rgba(10,10,10,0.7)]",
                optional && "max-md:hidden"
            )}
        >
            <h3 className="heading-md">{name}</h3>
            <p className="text-secondary">{description}</p>
        </div>
    );
}
