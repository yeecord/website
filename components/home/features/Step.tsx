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
                    "absolute left-0 top-0 text-white rounded-full -ml-[4.5rem] w-16 h-16",
                    "inline-flex flex-col items-center justify-center",
                    "shadow-2xl text-3xl font-bold",
                    icon?.className
                )}
            />
            {props.children}
        </div>
    );
}
