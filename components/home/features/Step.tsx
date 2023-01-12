import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Step({
    icon,
    ...props
}: { icon?: ComponentProps<"div"> } & ComponentProps<"div">) {
    return (
        <div {...props}>
            <div
                {...icon}
                className={twMerge(
                    "absolute left-0 top-0 text-white font-bold rounded-full",
                    "inline-flex flex-col items-center justify-center",
                    "shadow-2xl w-12 h-12 text-xl -ml-[3.5rem]",
                    "sm:w-16 sm:h-16 sm:text-3xl sm:-ml-[4.5rem]",
                    icon?.className
                )}
            />
            {props.children}
        </div>
    );
}
