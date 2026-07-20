import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export default function Gradient(props: Omit<ComponentProps<"img">, "alt">) {
  return (
    <img
      alt="gradient background"
      {...props}
      className={cn("pointer-events-none select-none", props.className)}
    />
  );
}
