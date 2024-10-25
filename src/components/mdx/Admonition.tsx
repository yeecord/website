import { Callout as Admonition } from "fumadocs-ui/components/callout";

export const Tip = ((p) => <Admonition {...p} />) as typeof Admonition;
export const Info = ((p) => (
  <Admonition {...p} type="info" />
)) as typeof Admonition;
export const Warning = ((p) => (
  <Admonition {...p} type="warn" />
)) as typeof Admonition;
export const ErrorCallout = ((p) => (
  <Admonition {...p} type="error" />
)) as typeof Admonition;
