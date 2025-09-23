import CyanPinkGradient from "@static/home/cyan-pink-gradient.svg";
import GradientRing from "@static/home/gradient-ring.svg";
import clsx from "clsx";
import Link from "fumadocs-core/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import styles from "./community.module.css";
import Gradient from "./components/Gradient";

export function Community() {
  return (
    <div className="relative z-[2] mt-8 flex flex-col items-center gap-5 overflow-hidden px-4 py-40 text-center">
      <Gradient
        src={CyanPinkGradient}
        className="-z-[1] absolute top-0 left-0 h-full w-full overflow-hidden object-cover opacity-20"
      />
      <h2 className="font-bold text-5xl text-pink-400 xl:text-6xl">
        <span>與</span>
        <span className="mx-2 text-cyan-300 [text-shadow:_#e66ad0_3px_5px]">
          我們
        </span>
        <span>聯繫</span>
      </h2>
      <p className="text-black text-lg sm:text-xl dark:text-slate-200">
        獲取我們的最新消息
      </p>

      <JoinButton />
    </div>
  );
}

function JoinButton() {
  return (
    <div className="relative z-[2] p-[6rem]">
      <Image
        alt="gradient ring"
        src={GradientRing}
        className={clsx(
          "-z-[1] pointer-events-none absolute top-0 left-0 h-full w-full select-none object-contain",
          styles["rotate-z"],
        )}
      />
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <Link
          href="https://x.com/yeecord"
          target="_blank"
          className={cn(buttonVariants({ color: "primary", size: "lg" }))}
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <title>X</title>
            <path
              fill="currentColor"
              d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"
            />
          </svg>
          @yeecord
        </Link>
        <Link
          href="https://discord.gg/yeecord"
          target="_blank"
          className={cn(buttonVariants({ color: "secondary", size: "lg" }))}
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <title>Discord</title>
            <path
              fill="currentColor"
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
            />
          </svg>
          <span>Discord</span>
        </Link>
      </div>
    </div>
  );
}
