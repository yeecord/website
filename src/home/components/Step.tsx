import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export default function Step({
  icon,
  ...props
}: { icon?: ComponentProps<"div"> } & ComponentProps<"div">) {
  return (
    <div {...props}>
      <div
        {...icon}
        className={cn(
          "absolute top-0 left-0 rounded-full font-bold text-white",
          "inline-flex flex-col items-center justify-center",
          "-ml-[3.5rem] h-12 w-12 text-xl shadow-2xl",
          "sm:-ml-[4.5rem] sm:h-16 sm:w-16 sm:text-3xl",
          icon?.className,
        )}
      />
      {props.children}
    </div>
  );
}
