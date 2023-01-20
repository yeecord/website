import cn from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import styles from "./Card.module.css";

export function Card({
    children,
    title,
    icon,
    arrow,
    href,
    ...props
}: {
    href: string;
    title: string;
    icon?: ReactNode;
    arrow?: boolean;
    children: ReactNode;
} & ComponentProps<typeof Link>) {
    const animatedArrow = arrow ? (
        <span
            className={cn(
                "transition-transform duration-75",
                "group-hover:translate-x-[2px]"
            )}
        >
            →
        </span>
    ) : null;

    return (
        <Link
            href={href}
            {...props}
            className={twMerge(
                styles.card,
                "flex flex-col justify-start overflow-hidden p-4",
                "bg-transparent dark:bg-background/50 rounded-lg",
                "border border-gray-200",
                "dark:border-neutral-800 dark:shadow-none",
                "shadow-sm shadow-gray-100",
                "no-underline transition-colors duration-200",
                "hover:bg-slate-50 hover:shadow-md hover:shadow-gray-100 hover:border-blue-500",
                "hover:dark:border-blue-500 hover:dark:bg-neutral-900/50 hover:dark:shadow-none hover:dark:text-white",
                props?.className
            )}
        >
            <span
                className={cn(styles.title, "gap-3 text-black dark:text-white")}
            >
                {icon != null && (
                    <div className="text-xl text-blue-500 mt-1">{icon}</div>
                )}
                {title}
                {animatedArrow}
            </span>
            <p className="text-base">{children}</p>
        </Link>
    );
}

export function Cards({
    children,
    num,
    ...props
}: { num?: number } & ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={twMerge(styles.cards, "mt-4 gap-4", props?.className)}
            style={
                {
                    "--rows": num || 3,
                    ...props.style,
                } as any
            }
        >
            {children}
        </div>
    );
}
