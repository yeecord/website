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
                "group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 bg-transparent text-current no-underline shadow-sm shadow-gray-100 transition-all duration-200",
                "dark:border-neutral-800 dark:shadow-none",
                "hover:bg-slate-50 hover:shadow-md hover:shadow-gray-100 hover:border-blue-500",
                "dark:hover:border-blue-500 dark:hover:bg-neutral-900/50 dark:hover:shadow-none",
                "active:shadow-sm active:shadow-gray-200",
                "p-4",
                props?.className
            )}
        >
            <span
                className={cn(
                    styles.title,
                    "gap-2 text-gray-700 dark:text-neutral-200",
                    "hover:text-gray-900 dark:hover:text-neutral-50"
                )}
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
