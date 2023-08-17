import { FileWarningIcon, InfoIcon } from "lucide-react";
import type { ReactNode, ReactElement } from "react";

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
    <div className="my-8 rounded-lg border bg-secondary px-4 text-muted-foreground">
      <div className="nd-not-prose mt-4 flex flex-row items-center gap-2">
        {
          {
            info: <InfoIcon className="h-4 w-4" />,
            warning: <FileWarningIcon className="h-4 w-4" />,
            error: <FileWarningIcon className="h-4 w-4" />,
            default: <InfoIcon className="h-4 w-4" />,
          }[type ?? "default"]
        }
        <p className="font-medium">{title}</p>
      </div>
      <span className="text-sm text-muted-foreground">{children}</span>
    </div>
  );
}

type Shortcut = (props: {
  title?: string;
  children: ReactNode;
}) => ReactElement;

export const Tip: Shortcut = (p) => <Admonition {...p} type="default" />;
export const Info: Shortcut = (p) => <Admonition {...p} type="info" />;
export const Warning: Shortcut = (p) => <Admonition {...p} type="warning" />;
export const Error: Shortcut = (p) => <Admonition {...p} type="error" />;

export default Admonition;
