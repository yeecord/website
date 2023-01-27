import cn, { clsx } from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const classes = {
  card: clsx(
    "flex flex-col justify-start overflow-hidden p-4 gap-2 no-underline rounded-lg",
    "bg-transparent border border-gray-200 shadow-sm shadow-gray-100",
    "dark:bg-background/50 dark:border-neutral-800 dark:shadow-none",
    "hover:bg-slate-50 hover:shadow-md hover:shadow-gray-100 hover:border-blue-500",
    "hover:dark:border-blue-500 hover:dark:bg-neutral-900/50 hover:dark:shadow-none hover:dark:text-white",
    "transition-colors duration-200 group"
  ),
  title: clsx(
    "flex font-bold flex-row items-center",
    "gap-2 text-black dark:text-white"
  ),
  cards: clsx(
    "[grid-template-columns:_repeat(auto-fill,minmax(max(250px,_calc((100%_-_1rem_*_2)_/_var(--rows))),_1fr))]"
  ),
};

export type CardProps = {
  href: string;
  title: string;
  icon?: ReactNode;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  target?: "_self" | "_blank";
};

/**
 * For safe, Won't accept all props from Link
 */
export function Card({
  children,
  title,
  icon,
  arrow,
  href,
  target,
  className,
}: CardProps) {
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

  const content = (
    <>
      <div className={classes.title}>
        {icon != null && <div className="text-2xl text-blue-500">{icon}</div>}
        <span>{title}</span>
        {animatedArrow}
      </div>
      {children && <p className="text-base">{children}</p>}
    </>
  );

  if (target === "_blank") {
    return (
      <a
        href={href}
        target="_blank"
        className={twMerge(classes.card, className)}
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target="_self"
      className={twMerge(classes.card, className)}
    >
      {content}
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
      className={twMerge("mt-4 grid gap-4", props?.className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(max(250px, calc((100% - 1rem * 2) / ${
          num || 3
        })), 1fr))`,
        ...props.style,
      }}
    >
      {children}
    </div>
  );
}
