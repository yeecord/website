import { type ComponentProps, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { SafeLink } from "next-docs-zeta/link";
import { ChevronRightIcon } from "lucide-react";

/**
 * For safe, Won't accept all props from Link
 */
export function LinkButton({
  variant,
  icon,
  children,
  wrapper,
  ...props
}: {
  icon?: ReactNode;
  variant?: "secondary" | "primary";
  wrapper?: ComponentProps<"div">;
} & ComponentProps<typeof SafeLink>) {
  return (
    <div
      {...wrapper}
      className={twMerge("nd-not-prose flex", wrapper?.className)}
    >
      <SafeLink
        {...props}
        className={twMerge(
          classes.base,
          variant === "primary" && classes.primary,
          variant === "secondary" && classes.secondary,
          icon != null ? "px-6" : "pl-7 pr-5",
          props.className,
        )}
      >
        {icon} {children}
        {icon == null && <ChevronRightIcon className="h-4 w-4" />}
      </SafeLink>
    </div>
  );
}

const classes = {
  base: "py-2 rounded-lg font-medium text-sm flex flex-row gap-2 items-center justify-center",
  primary:
    "bg-primary text-primary-foreground transition-colors hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80",
};
