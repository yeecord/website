import clsx from "clsx";
import { ReactNode } from "react";
import { RiFeedbackFill, RiGithubFill } from "react-icons/ri";

export default function Sponsor() {
    return (
        <div
            className={clsx(
                "bg-white dark:bg-zinc-900/50 p-4 py-[6rem] mt-[5rem]",
                "flex flex-col gap-3 items-center text-center w-full",
                "font-semibold"
            )}
        >
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

            <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-4 w-full max-w-[60rem]">
                <Card
                    title="照顧機器龍"
                    text="在 Github 上貢獻"
                    icon={<RiGithubFill />}
                    href="https://github.com/yeecord/website"
                >
                    貢獻
                </Card>
                <Card
                    title="給予反饋"
                    text="在 Discord 回饋資訊給我們"
                    icon={<RiFeedbackFill />}
                    href="https://discord.gg/yeecord"
                >
                    加入群組
                </Card>
            </div>
        </div>
    );
}

function Card({
    title,
    text,
    icon,
    children,
    href,
}: {
    title: string;
    text: string;
    icon: ReactNode;
    children: string;
    href: string;
}) {
    return (
        <div className="card text-start">
            <div className="h-stack">
                <div className="p-3 bg-purple-400 dark:bg-purple-500 text-2xl rounded-md text-white">
                    {icon}
                </div>
                <div>
                    <p className="heading-md">{title}</p>
                    <p className="text-secondary">{text}</p>
                </div>
            </div>
            <a href={href} target="_blank" rel="noreferrer">
                <button
                    className={clsx(
                        "text-white py-1 text-md rounded-xl mt-6 shadow-lg w-[8rem] font-bold",
                        "bg-purple-400 shadow-purple-300",
                        "dark:bg-purple-500 dark:shadow-purple-700"
                    )}
                >
                    {children}
                </button>
            </a>
        </div>
    );
}
