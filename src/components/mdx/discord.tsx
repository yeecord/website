import {
  ChevronDown,
  Eye,
  X,
  Gift,
  Hash,
  SmilePlus,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "~/utils/cn";

// Discord's panels carry no hairline border; they separate by sitting darker than what
// is behind them. Every demo shares this shell so none of them drifts back to a card.
export function DiscordSurface({
  channel,
  topic,
  className,
  children,
}: {
  channel?: string;
  topic?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border border-black/40 bg-discord-bg font-discord text-discord-text shadow-lg">
      {channel ? (
        <div className="flex items-center gap-2 border-b border-black/30 px-4 py-2.5 text-sm">
          <Hash className="size-4 shrink-0 text-discord-muted" />
          <span className="font-semibold text-white">{channel}</span>
          {topic ? (
            <span className="ml-2 hidden truncate border-l border-discord-secondary pl-3 text-xs text-discord-muted sm:inline">
              {topic}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className={cn("p-4", className)}>{children}</div>
    </div>
  );
}

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
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-discord-hairline bg-discord-embed font-discord text-sm">
      <div className="flex items-baseline gap-2.5 px-4 py-2">
        <span className="font-semibold text-white">{name.split(" ")[0]}</span>
        {description ? (
          <span className="text-discord-muted">{description}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 bg-discord-input px-4 py-2.5 text-discord-text">
        <BotAvatar className="size-6" />
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
    <DiscordSurface className="flex flex-col gap-4">{children}</DiscordSurface>
  );
}

export function BotAvatar({ className }: { className?: string }) {
  return (
    <img
      src="/img/logo.svg"
      alt=""
      className={cn("shrink-0 rounded-full bg-discord-avatar p-0.5", className)}
    />
  );
}

export const BOT_NAME = "YEE式機器龍";

export interface CommandUse {
  user: string;
  name: string;
  used: string;
}

export interface EphemeralNote {
  note: string;
  dismiss: string;
}

/// One chat message in Discord's cozy layout: a 40px avatar, content from 72px.
export function DiscordMessage({
  author = BOT_NAME,
  bot = author === BOT_NAME,
  color,
  time,
  command,
  ephemeral,
  compact,
  children,
}: {
  author?: string;
  bot?: boolean;
  color?: string;
  time?: string;
  /** The slash command this message answers, drawn as the reply line above it. */
  command?: CommandUse;
  ephemeral?: EphemeralNote;
  /** A follow-up from the same author, which Discord draws without avatar and name. */
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 text-base leading-[1.375rem] text-discord-text",
        ephemeral &&
          "-mx-4 bg-discord-blurple/5 px-4 py-0.5 shadow-[inset_2px_0_0_var(--color-discord-blurple)]",
      )}
    >
      {command ? <CommandLine {...command} /> : null}
      {compact ? (
        <span />
      ) : bot ? (
        <BotAvatar className="mt-0.5 size-10" />
      ) : (
        <span
          className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-discord-blurple font-semibold text-white"
          style={color ? { backgroundColor: color } : undefined}
        >
          {author.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        {compact ? null : (
          <div className="flex min-h-[22px] flex-wrap items-baseline gap-x-1">
            <span className="font-medium text-white">{author}</span>
            {bot ? (
              <span className="self-center rounded bg-discord-blurple px-1 text-xs leading-4 font-semibold text-white uppercase">
                App
              </span>
            ) : null}
            {time ? (
              <span className="text-xs font-medium text-discord-time">
                {time}
              </span>
            ) : null}
          </div>
        )}
        <div className="grid w-fit max-w-[min(600px,100%)] gap-2 pt-0.5 [&_p]:m-0">
          {children}
        </div>
        {ephemeral ? (
          <p className="m-0 mt-1 flex items-center gap-1 text-xs text-discord-muted">
            <Eye className="size-4" />
            {ephemeral.note}
            <span aria-hidden>·</span>
            <span className="text-discord-link">{ephemeral.dismiss}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CommandLine({ user, name, used }: CommandUse) {
  return (
    <div className="relative col-span-2 mb-1 flex min-w-0 items-center gap-1 pl-14 text-sm leading-[18px] text-discord-muted">
      <span className="absolute top-2 left-[18px] h-3 w-[30px] rounded-tl-md border-t-2 border-l-2 border-discord-spine" />
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-discord-secondary text-[10px] text-white">
        {user.slice(0, 1)}
      </span>
      <span className="font-medium text-white">{user}</span>
      <span className="shrink-0">{used}</span>
      <span className="truncate text-discord-link">/{name}</span>
    </div>
  );
}

/// A Components V2 container: a card one step lighter than the chat, with an optional accent bar.
export function DiscordContainer({
  accent,
  className,
  children,
}: {
  accent?: string | boolean;
  className?: string;
  children: ReactNode;
}) {
  const accentColor =
    accent === true ? "var(--color-discord-blurple)" : accent || undefined;

  return (
    <div
      className={cn(
        "relative grid min-w-0 gap-2 overflow-hidden rounded-lg border border-discord-hairline bg-discord-card p-4",
        className,
      )}
    >
      {accentColor ? (
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accentColor }}
        />
      ) : null}
      {children}
    </div>
  );
}

/// A Text Display: `h2` stands for `##`, `small` for `-#` and `blockquote` for `>`.
export function DiscordText({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("discord-markdown", className)}>{children}</div>;
}

export function DiscordSection({
  accessory,
  children,
}: {
  accessory: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="grid min-w-0 flex-1 gap-1">{children}</div>
      <div className="shrink-0">{accessory}</div>
    </div>
  );
}

export function DiscordSeparator({
  large,
  divider = true,
}: {
  large?: boolean;
  divider?: boolean;
}) {
  return (
    <div
      className={cn(divider ? "h-px bg-discord-border" : "h-0", large && "my-2")}
    />
  );
}

export function DiscordRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export type DiscordButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "link";

export function DiscordButton({
  variant = "secondary",
  emoji,
  disabled,
  pressed,
  onClick,
  children,
}: {
  variant?: DiscordButtonVariant;
  emoji?: string;
  disabled?: boolean;
  /** Holds the pressed look, for a demo that shows where a click lands. */
  pressed?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  const content = (
    <>
      {emoji ? <AppEmoji name={emoji} className="size-[18px] align-[0]" /> : null}
      <span>{children}</span>
      {variant === "link" ? (
        <SquareArrowOutUpRight className="size-3.5 opacity-80" />
      ) : null}
    </>
  );
  const look = {
    "data-variant": variant,
    "data-pressed": pressed ? "" : undefined,
    "aria-disabled": disabled || undefined,
  };

  if (!onClick) {
    return (
      <span className="discord-button" {...look}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="discord-button cursor-pointer"
      {...look}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </button>
  );
}

export function DiscordSelect({
  placeholder,
  value,
}: {
  placeholder: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex min-h-10 w-[400px] max-w-full items-center justify-between gap-2 rounded-lg border border-discord-border bg-black/8 py-2 pr-2 pl-3 font-medium">
      <span className={value ? "text-discord-text" : "text-discord-subtle"}>
        {value ?? placeholder}
      </span>
      <ChevronDown className="size-5 shrink-0 text-discord-muted" />
    </div>
  );
}

export function DiscordGallery({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="max-h-[350px] w-full rounded-lg object-cover"
    />
  );
}

/// An application emoji: one of the Fluent Emoji Flat images the bot uploads to Discord.
export function AppEmoji({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      src={`/img/emoji/${name}.png`}
      alt={`:${name}:`}
      className={cn(
        "inline-block size-[1.375em] object-contain align-[-0.3em]",
        className,
      )}
    />
  );
}

export function Mention({
  color,
  children,
}: {
  color?: string;
  children: ReactNode;
}) {
  return (
    <span
      className="rounded-[3px] bg-discord-pill px-0.5 font-medium text-discord-pill-foreground"
      style={
        color
          ? {
              color,
              backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}

export function Spoiler({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#7d7e87] text-transparent select-none">
      {children}
    </span>
  );
}

export function Timestamp({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[3px] bg-[rgb(151_151_159/0.161)] px-0.5">
      {children}
    </span>
  );
}

export type StatusEmoji = "check" | "info" | "warning" | "cross" | "pending";

/// A status reply as the bot sends it: the outcome after its emoji, every later line as `-#`.
export function DiscordStatus({
  emoji,
  title,
  notes = [],
}: {
  emoji: StatusEmoji;
  title: ReactNode;
  notes?: ReactNode[];
}) {
  return (
    <DiscordText>
      <p>
        <AppEmoji name={emoji} /> {title}
      </p>
      {notes.map((note, index) => (
        <small key={index}>{note}</small>
      ))}
    </DiscordText>
  );
}


/// Bot copy with `{name}` placeholders, each replaced by its value, which may be a mention.
export function Interpolate({
  text,
  values,
}: {
  text: string;
  values: Record<string, ReactNode>;
}) {
  return text
    .split(/\{(\w+)\}/)
    .map((part, index) => (
      <Fragment key={index}>{index % 2 ? values[part] : part}</Fragment>
    ));
}

export interface ModalField {
  label: string;
  description?: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  select?: boolean;
}

/// A modal the bot opens: its fields, then a footer to cancel or submit.
export function DiscordModal({
  title,
  fields,
  cancel,
  submit,
  submitPressed,
  submitHint,
  className,
}: {
  title: string;
  fields: ModalField[];
  cancel: string;
  submit: string;
  submitPressed?: boolean;
  /** Drawn over the submit button, such as the cursor of a demo. */
  submitHint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl border border-discord-hairline bg-discord-bg text-sm text-discord-text shadow-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-1">
        <BotAvatar className="size-6" />
        <span className="text-xl font-semibold text-white">{title}</span>
        <X className="ms-auto size-5 text-discord-muted" />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-2">
            <div>
              <p className="m-0 text-base font-semibold text-white">
                {field.label}
              </p>
              {field.description ? (
                <p className="m-0 text-discord-muted">{field.description}</p>
              ) : null}
            </div>
            <div
              className={cn(
                "flex justify-between gap-2 rounded-lg border border-discord-border bg-discord-option px-3 py-2.5 text-base whitespace-pre-line",
                field.multiline && "min-h-20",
              )}
            >
              <span
                className={
                  field.value ? "text-discord-text" : "text-discord-placeholder"
                }
              >
                {field.value ?? field.placeholder}
              </span>
              {field.select ? (
                <ChevronDown className="size-5 shrink-0 text-discord-muted" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 bg-discord-embed px-5 py-4">
        <span className="px-4 font-medium">{cancel}</span>
        <span className="relative inline-flex">
          <DiscordButton variant="primary" pressed={submitPressed}>
            {submit}
          </DiscordButton>
          {submitHint}
        </span>
      </div>
    </div>
  );
}
