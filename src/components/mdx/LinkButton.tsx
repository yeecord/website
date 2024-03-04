import { type ComponentProps, type ReactNode } from "react";
import Link, { type LinkProps } from "fumadocs-core/link";
import { ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

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
} & LinkProps) {
  return (
    <div {...wrapper} className={cn("nd-not-prose flex", wrapper?.className)}>
      <Link
        {...props}
        className={cn(
          buttonVariants({ color: variant ?? "secondary" }),
          icon != null ? "px-6" : "pl-7 pr-5",
          props.className,
        )}
      >
        {icon} {children}
        {icon == null && <ChevronRightIcon className="h-4 w-4" />}
      </Link>
    </div>
  );
}
