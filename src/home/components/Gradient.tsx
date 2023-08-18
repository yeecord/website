import { cn } from "@utils/cn";
import Image, { type ImageProps } from "next/image";

export default function Gradient(props: Omit<ImageProps, "alt">) {
  return (
    <Image
      alt=""
      {...props}
      className={cn("pointer-events-none select-none", props.className)}
    />
  );
}
