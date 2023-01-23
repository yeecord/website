import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FiArrowRight } from "react-icons/fi";

/**
 * For safe, Won't accept all props from Link
 */
export function LinkButton({
    href,
    target,
    link,
    ...props
}: {
    href: string;
    target?: "_self" | "_blank";
    link?: Partial<ComponentProps<typeof Link>>;
} & InnerButtonProps) {
    if (target === "_blank") {
        return (
            <a {...link} href={href} target="_blank" rel="noreferrer">
                <InnerButton {...props} />
            </a>
        );
    }
    return (
        <Link
            {...link}
            href={href}
            target="_self"
            className={twMerge("block", link?.className)}
        >
            <InnerButton {...props} />
        </Link>
    );
}

const classes = {
    base: clsx(
        "w-full h-full py-2 text-lg rounded-lg font-bold",
        "flex flex-row gap-2 items-center justify-center"
    ),
    primary: clsx(
        "text-white bg-gradient-to-br from-cyan-300 to-blue-600",
        "shadow-lg shadow-blue-400 dark:shadow-blue-600",
        "hover:from-blue-500 hover:to-blue-600",
        "dark:hover:from-cyan-100 dark:hover:to-blue-600"
    ),
    secondary: clsx(
        "bg-zinc-100 dark:bg-zinc-800",
        "hover:bg-zinc-200 dark:hover:bg-zinc-700"
    ),
};

type InnerButtonProps = {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    variant?: "secondary" | "primary";
};

function InnerButton({ variant, icon, className, children }: InnerButtonProps) {
    return (
        <button
            className={twMerge(
                clsx(
                    classes.base,
                    variant === "primary" && classes.primary,
                    variant === "secondary" && classes.secondary
                ),
                icon != null ? "px-6" : "pl-7 pr-5",
                className
            )}
        >
            {icon} {children}{" "}
            {icon == null && <FiArrowRight className="text-xl" />}
        </button>
    );
}
