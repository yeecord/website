import { type User, fetchUser, resolveUserAvatar } from "@utils/api";
import clsx from "clsx";
import Image from "next/image";
import { RiUserFill } from "react-icons/ri";
import useSWR from "swr";

export default function LoginButton() {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR<User, unknown>("user", fetchUser, {
    refreshInterval: () => 10000,
    errorRetryCount: 0,
  });

  if (error != null) {
    return (
      <button
        className={clsx(
          "break-keep rounded-md px-5 py-1 font-bold",
          "bg-black text-white dark:bg-white dark:text-black",
        )}
      >
        控制面板
      </button>
    );
  }

  if (user?.avatar == null || isLoading) {
    return (
      <div
        className={clsx(
          "flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full",
          "bg-blue-400 text-white",
        )}
      >
        <RiUserFill className="text-lg" />
      </div>
    );
  }

  return (
    <Image
      alt="avatar"
      src={`${resolveUserAvatar(user)}?size=32`}
      unoptimized
      width="30"
      height="30"
      className="rounded-full"
    />
  );
}
