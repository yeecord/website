import { Gift, SmilePlus } from "lucide-react";
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
    <div className="not-prose my-4 overflow-hidden rounded-lg bg-discord-embed text-sm">
      <div className="flex items-baseline gap-2.5 px-4 py-2">
        <span className="font-semibold text-white">{name.split(" ")[0]}</span>
        {description ? (
          <span className="text-discord-muted">{description}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 bg-discord-input px-4 py-2.5 text-discord-text">
        <img
          src="/img/logo.svg"
          alt=""
          className="size-6 shrink-0 rounded-full bg-discord-avatar p-0.5"
        />
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="font-semibold text-white">/{name}</span>
          {options.map((option) => (
            <span
              key={option.name}
              className={cn(
                option.value
                  ? "rounded border border-discord-option-border/60 bg-discord-option px-2 py-0.5 text-discord-text"
                  : "text-discord-placeholder",
              )}
            >
              {option.value ?? `${option.name}${option.required ? "" : "?"}`}
            </span>
          ))}
        </span>
        <span className="ms-auto flex shrink-0 items-center gap-3 text-discord-icon">
          <Gift className="size-5" />
          <SmilePlus className="size-5" />
        </span>
      </div>
    </div>
  );
}

export function DiscordChat({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 flex flex-col gap-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
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
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple font-semibold text-white"
        style={color ? { backgroundColor: color } : undefined}
      >
        {author.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-white">{author}</span>
          {bot ? (
            <span className="rounded bg-discord-blurple px-1 py-px text-[10px] font-semibold uppercase text-white">
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
  color = "var(--color-discord-blurple)",
  children,
}: {
  title?: string;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="max-w-md rounded border-l-4 bg-discord-embed p-3"
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
        variant === "primary" && "bg-discord-blurple",
        variant === "secondary" && "bg-discord-secondary",
        variant === "success" && "bg-discord-success",
        variant === "danger" && "bg-discord-danger",
      )}
    >
      {children}
    </span>
  );
}
