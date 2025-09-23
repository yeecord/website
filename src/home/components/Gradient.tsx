import Image, { type ImageProps } from "next/image";
import { cn } from "@/utils/cn";

export default function Gradient(props: Omit<ImageProps, "alt">) {
  return (
    <Image
      alt="gradient background"
      {...props}
      className={cn("pointer-events-none select-none", props.className)}
    />
  );
}
