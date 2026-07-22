import Link, { type LinkProps } from "fumadocs-core/link";
import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/**
 * For safe, Won't accept all props from Link
 */
export function LinkButton({
  variant = "secondary",
  icon,
  children,
  ...props
}: {
  icon?: ReactNode;
  variant?: "secondary" | "primary" | "chunky";
} & LinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        variant === "chunky"
          ? "btn-chunky not-prose"
          : [
              buttonVariants({ color: variant, className: "not-prose" }),
              icon != null ? "px-6" : "pr-5 pl-7",
            ],
        props.className,
      )}
    >
      {icon}
      {children}
      {icon == null && variant !== "chunky" && (
        <ChevronRightIcon className="h-4 w-4" />
      )}
    </Link>
  );
}
