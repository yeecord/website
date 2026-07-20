import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface CommandOption {
  name: string;
  value?: string;
  required?: boolean;
}

export function SlashCommand({
  name,
  options = [],
  description,
}: {
  name: string;
  options?: CommandOption[];
  description?: string;
}) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border bg-fd-card text-sm">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono">
        <span className="font-semibold text-blue-500">/{name}</span>
        {options.map((option) => (
          <span
            key={option.name}
            className={cn(
              "rounded-md px-1.5 py-0.5",
              option.value
                ? "bg-blue-500/10 text-blue-500"
                : "bg-fd-muted text-fd-muted-foreground",
            )}
          >
            {option.value ?? `${option.name}${option.required ? "" : "?"}`}
          </span>
        ))}
      </div>
      {description ? (
        <p className="border-t px-3 py-2 text-fd-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function DiscordChat({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 flex flex-col gap-4 rounded-lg border bg-[#313338] p-4 text-sm text-[#dbdee1]">
      {children}
    </div>
  );
}

export function DiscordMessage({
  author = "YEE式機器龍",
  bot = author === "YEE式機器龍",
  color,
  children,
}: {
  author?: string;
  bot?: boolean;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5865f2] font-semibold text-white"
        style={color ? { backgroundColor: color } : undefined}
      >
        {author.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-white">{author}</span>
          {bot ? (
            <span className="rounded bg-[#5865f2] px-1 py-px text-[10px] font-semibold uppercase text-white">
              App
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 space-y-2 leading-relaxed [&_p]:m-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DiscordEmbed({
  title,
  color = "#5865f2",
  children,
}: {
  title?: string;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="max-w-md rounded border-l-4 bg-[#2b2d31] p-3"
      style={{ borderLeftColor: color }}
    >
      {title ? <p className="mb-1 font-semibold text-white">{title}</p> : null}
      {children}
    </div>
  );
}

export function DiscordButton({
  variant = "secondary",
  children,
}: {
  variant?: "primary" | "secondary" | "success" | "danger";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-white",
        variant === "primary" && "bg-[#5865f2]",
        variant === "secondary" && "bg-[#4e5058]",
        variant === "success" && "bg-[#248046]",
        variant === "danger" && "bg-[#da373c]",
      )}
    >
      {children}
    </span>
  );
}
