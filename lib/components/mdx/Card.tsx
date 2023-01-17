import cn from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import styles from "./Card.module.css";

export function Card({
    children,
    title,
    icon,
    image,
    arrow,
    href,
    ...props
}: {
    href: string;
    title: string;
    icon?: ReactNode;
    image?: boolean;
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

    if (image) {
        return (
            <Link
                href={href}
                {...props}
                className={twMerge(
                    styles.card,
                    "group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 bg-gray-100 text-current no-underline shadow shadow-gray-100 transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-50 dark:shadow-none",
                    "hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 dark:hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:shadow-none",
                    "active:shadow-sm active:shadow-gray-200",
                    props?.className
                )}
            >
                {children}
                <span
                    className={cn(
                        styles.title,
                        "gap-2 p-4 text-gray-700 dark:text-gray-300 mt-auto",
                        "hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                >
                    {icon}
                    <span className="flex gap-1">
                        {title}
                        {animatedArrow}
                    </span>
                </span>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            {...props}
            className={twMerge(
                styles.card,
                "group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 bg-transparent text-current no-underline shadow-sm shadow-gray-100 transition-all duration-200 dark:border-neutral-800 dark:shadow-none",
                "hover:border-gray-300 hover:bg-slate-50 hover:shadow-md hover:shadow-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:shadow-none",
                "active:shadow-sm active:shadow-gray-200",
                props?.className
            )}
        >
            <span
                className={cn(
                    styles.title,
                    "gap-2 p-4 text-gray-700 dark:text-neutral-200",
                    "hover:text-gray-900 dark:hover:text-neutral-50"
                )}
            >
                {icon}
                {title}
                {animatedArrow}
            </span>
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
