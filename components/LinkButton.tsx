import Link from "next/link";
import { ComponentProps, HTMLAttributeAnchorTarget } from "react";

export function LinkButton({
  href,
  target,
  ...props
}: ComponentProps<"button"> & {
  href: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  return (
    <Link href={href} target={target}>
      <button {...props} />
    </Link>
  );
}
