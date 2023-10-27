import { Callout as Admonition } from "next-docs-ui/components/callout";

export const Tip = ((p) => <Admonition {...p} />) as typeof Admonition;
export const Info = ((p) => (
  <Admonition {...p} type="info" />
)) as typeof Admonition;
export const Warning = ((p) => (
  <Admonition {...p} type="warn" />
)) as typeof Admonition;
export const Error = ((p) => (
  <Admonition {...p} type="error" />
)) as typeof Admonition;
