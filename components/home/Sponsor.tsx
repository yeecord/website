import clsx from "clsx";
import { ReactNode } from "react";
import {
    RiFeedbackFill,
    RiGithubFill,
    RiMoneyDollarBoxFill,
} from "react-icons/ri";

export default function Sponsor() {
    return (
        <div className="bg-white dark:bg-zinc-900/50 p-4 py-[6rem] mt-[5rem]">
            <div className="flex flex-col gap-3 mx-auto text-center w-full max-w-[60rem]">
                <p className="text-purple-400 text-lg tracking-widest">
                    喜歡YEE式機器龍?
                </p>
                <h1 className="heading-xl">支持我們</h1>
                <p className="text-secondary heading-md">
                    照顧機器龍是一項艱鉅的工作
                    <span className="max-sm:hidden">, </span>
                    <br className="sm:hidden" />
                    以實際行動支持我們吧
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-5 gap-4">
                    <Card
                        title="抖內零用錢"
                        text="加入我們的Patreon"
                        icon={<RiMoneyDollarBoxFill />}
                    >
                        抖內
                    </Card>
                    <Card
                        title="照顧機器龍"
                        text="在Github上貢獻"
                        icon={<RiGithubFill />}
                    >
                        貢獻
                    </Card>
                    <Card
                        title="給予反饋"
                        text="通過Discord給我們反饋"
                        icon={<RiFeedbackFill />}
                    >
                        加入社區
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    text,
    icon,
    children,
}: {
    title: string;
    text: string;
    icon: ReactNode;
    children: string;
}) {
    return (
        <div className="card text-start last:sm:max-md:col-span-2">
            <div className="h-stack">
                <div className="p-3 bg-purple-400 dark:bg-purple-500 text-2xl rounded-md text-white">
                    {icon}
                </div>
                <div>
                    <p className="heading-md">{title}</p>
                    <p className="text-secondary">{text}</p>
                </div>
            </div>
            <button
                className={clsx(
                    "text-white py-1 text-md rounded-xl mt-6 shadow-lg w-[8rem]",
                    "bg-purple-400 shadow-purple-300",
                    "dark:bg-purple-500 dark:shadow-purple-700"
                )}
            >
                {children}
            </button>
        </div>
    );
}
