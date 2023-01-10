import PinkWave from "@static/home/pink-wave.svg";
import Image from "next/image";
import { LinkButton } from "@components/LinkButton";
import clsx from "clsx";

const comments: CommentData[] = [
    {
        name: "Money",
        avatar: "/blog/money.jpg",
        title: "Frontend Engineer",
        text: "Yeecord improved our discord server and help us to grow from a small server to a large community",
    },
    {
        name: "Kane",
        avatar: "/blog/Gary50613.jpg",
        title: "Bot Developer",
        text: "I love Yeecord! It's an awesome bot which gave us a lot of fun!",
    },
    {
        name: "Nathan",
        avatar: "/blog/nathan.jpg",
        title: "Server Manager",
        text: "I have never seen a chinese discord bot like this before",
    },
];

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
            <h3 className="heading-md text-secondary">
                你可以成為他們的一部分
            </h3>
            <div className="h-stack">
                <LinkButton
                    href="/invite"
                    className="secondary-button shadow-lg backdrop-blur-lg"
                >
                    開始使用
                </LinkButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
                {comments.map((comment, i) => (
                    <Comment key={i} {...comment} />
                ))}
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

type CommentData = {
    name: string;
    avatar: string;
    title: string;
    text: string;
};
function Comment({ name, title, text, avatar }: CommentData) {
    return (
        <div className="card text-start bg-slate-100/50 dark:bg-purple-400/10 p-6">
            <div className="flex flex-row gap-2 items-center">
                <Image
                    src={avatar}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div className="flex flex-col">
                    <h2 className="heading-md">{name}</h2>
                    <h3 className="text-secondary">{title}</h3>
                </div>
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{text}</p>
        </div>
    );
}
