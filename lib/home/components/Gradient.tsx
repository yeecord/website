import Image, { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

export default function Gradient(props: Omit<ImageProps, "alt">) {
    return (
        <Image
            alt=""
            {...props}
            className={twMerge(
                "pointer-events-none select-none",
                props.className
            )}
        />
    );
}
