import { Callout } from "nextra-theme-docs";
import { ReactElement } from "react";
import { ReactNode } from "react";

export function Admonition({
  children,
  title,
  type,
}: {
  title?: string;
  children?: ReactNode;
  type?: "info" | "warning" | "error" | "default";
}) {
  return (
    <Callout type={type}>
      <b>{title}</b>
      <span className="block text-base">{children}</span>
    </Callout>
  );
}

type ShortCut = (props: {
  title?: string;
  children: ReactNode;
}) => ReactElement;

export const Tip: ShortCut = (p) => <Admonition {...p} type="default" />;
export const Info: ShortCut = (p) => <Admonition {...p} type="info" />;
export const Warning: ShortCut = (p) => <Admonition {...p} type="warning" />;
export const Error: ShortCut = (p) => <Admonition {...p} type="error" />;

export default Admonition;
