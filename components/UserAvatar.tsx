import clsx from "clsx";
import Image from "next/image";
import { RiUserFill } from "react-icons/ri";
import useSWR from "swr";
import { API_ENDPOINT, resolveUserAvatar } from "../src/config";
import { User } from "../src/types";

async function fetchUser() {
    const res = await fetch(`${API_ENDPOINT}/users/@me`, {
        credentials: "include",
    });

    return (await res.json()) as User;
}

export default function UserAvatar() {
    const {
        data: user,
        isLoading,
        error,
    } = useSWR("user", fetchUser, {
        refreshInterval: () => 10000,
    });

    if (isLoading || error != null) {
        return (
            <button
                className={clsx(
                    "rounded-md px-5 py-1 font-bold break-keep",
                    "text-white bg-black dark:text-black dark:bg-white"
                )}
            >
                控制面板
            </button>
        );
    }

    if (user?.avatar == null) {
        return (
            <div
                className={clsx(
                    "rounded-full w-7 h-7 flex flex-col justify-center items-center",
                    "bg-blue-400 text-white"
                )}
            >
                <RiUserFill className="text-lg" />
            </div>
        );
    }

    return (
        <Image
            alt="avatar"
            src={resolveUserAvatar(user)}
            width="26"
            height="26"
            className="rounded-full"
        />
    );
}
