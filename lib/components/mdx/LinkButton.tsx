import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FiArrowRight } from "react-icons/fi";

export function LinkButton({
    href,
    target,
    children,
    className,
    icon,
    variant = "secondary",
    link,
}: {
    href: string;
    target?: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    variant?: "secondary" | "primary";
    link?: Partial<ComponentProps<typeof Link>>;
}) {
    return (
        <Link
            href={href}
            target={target}
            {...link}
            className={twMerge("block", link?.className)}
        >
            <button
                className={twMerge(
                    clsx(
                        "w-full h-full py-2 text-lg rounded-lg font-medium",
                        variant === "primary" && [
                            "text-white bg-gradient-to-br from-cyan-300 to-blue-600",
                            "shadow-lg shadow-blue-400 dark:shadow-blue-600",
                            "hover:from-blue-500 hover:to-blue-600",
                            "dark:hover:from-cyan-100 dark:hover:to-blue-600",
                        ],
                        variant === "secondary" && [
                            "bg-zinc-100 dark:bg-zinc-800",
                            "hover:bg-zinc-200 dark:hover:bg-zinc-700",
                        ],
                        "flex flex-row gap-2 items-center justify-center"
                    ),
                    icon != null ? "px-6" : "pl-7 pr-5",
                    className
                )}
            >
                {icon} {children}{" "}
                {icon == null && <FiArrowRight className="text-xl" />}
            </button>
        </Link>
    );
}
