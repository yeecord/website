import Link from "next/link";
import { type ComponentProps, type HTMLAttributeAnchorTarget } from "react";

export default function LinkButton({
  href,
  target,
  ...props
}: ComponentProps<"button"> & {
  href: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  if (target === "_blank") {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        <button {...props} />
      </a>
    );
  }

  return (
    <Link href={href} target={target}>
      <button {...props} />
    </Link>
  );
}
