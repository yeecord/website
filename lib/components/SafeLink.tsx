import Link from "next/link";
import { ComponentProps } from "react";

export function SafeLink(props: Omit<ComponentProps<"a">, "ref">) {
    const safe =
        props.href == null ||
        props.href.startsWith("/") ||
        props.href.startsWith("#");

    if (!safe) {
        return <a {...props} target="_blank" rel="noreferrer nofollow" />;
    }

    return <Link {...props} href={props.href ?? "#"} target="_self" prefetch={false} />;
}
