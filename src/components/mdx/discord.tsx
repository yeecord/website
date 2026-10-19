import { Gift, Hash, SmilePlus, X } from "lucide-react";
import { Fragment, isValidElement, type ReactNode } from "react";
import {
  AlertCircleIcon,
  ChevronIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  FileIllustration,
  ShopIcon,
  ThinkingDots,
} from "~/components/mdx/discord-icons";
import { SpoilerCover } from "~/components/mdx/discord-spoiler";
import { cn } from "~/utils/cn";

export { Spoiler, SpoilerCover } from "~/components/mdx/discord-spoiler";
export {
  DiscordSelect,
  type SelectOption,
} from "~/components/mdx/discord-select";

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
          <span className="font-semibold text-discord-strong">{channel}</span>
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
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-discord-hairline bg-discord-popover font-discord text-sm">
      <div className="flex items-baseline gap-2.5 px-4 py-2">
        <span className="font-semibold text-discord-strong">
          {name.split(" ")[0]}
        </span>
        {description ? (
          <span className="text-discord-muted">{description}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 bg-discord-input px-4 py-2.5 text-discord-text">
        <BotAvatar className="size-6" />
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="font-semibold text-discord-strong">/{name}</span>
          {options.map((option) => (
            <span
              key={option.name}
              className={cn(
                option.value
                  ? "rounded border border-discord-border bg-discord-chip px-2 py-0.5 text-discord-text"
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

/// The APP tag after a bot's name, in Discord's chat-scaled size.
export function AppTag() {
  return (
    <span className="inline-flex h-[15px] shrink-0 items-center self-center rounded bg-discord-blurple px-[4.4px] text-[12.8px] leading-[15px] font-semibold text-white uppercase">
      App
    </span>
  );
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
            <span className="font-medium text-discord-strong">{author}</span>
            {bot ? <AppTag /> : null}
            {time ? (
              <span
                className={cn(
                  "text-xs leading-[22px] font-medium text-discord-time",
                  bot && "ml-1",
                )}
              >
                {time}
              </span>
            ) : null}
          </div>
        )}
        <div className="grid w-fit max-w-[min(600px,100%)] grid-cols-[minmax(0,1fr)] gap-2 pt-0.5 [&_p]:m-0">
          {children}
        </div>
        {ephemeral ? (
          <p className="m-0 mt-1 text-xs leading-4 text-discord-muted">
            <EyeIcon className="mr-1 inline size-4 align-text-bottom" />
            {ephemeral.note}
            <span aria-hidden> • </span>
            <span className="cursor-pointer text-discord-link hover:underline">
              {ephemeral.dismiss}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

/// The reply line over a slash command's answer, joined to the avatar by a rounded spine.
function CommandLine({ user, name, used }: CommandUse) {
  return (
    <div className="relative col-span-2 mb-1 flex h-[18px] min-w-0 items-center gap-1 pl-14 text-sm leading-[18px] whitespace-nowrap text-discord-text">
      <span
        aria-hidden
        className="absolute top-2 left-[19px] h-3.5 w-[33px] rounded-tl-md border-t-2 border-l-2 border-discord-spine"
      />
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-discord-secondary text-[10px] text-white">
        {user.slice(0, 1)}
      </span>
      <span className="font-medium text-discord-strong/64">{user}</span>
      <span className="shrink-0">{used}</span>
      <span className="truncate font-medium text-discord-link/64">/{name}</span>
    </div>
  );
}

/// A Components V2 container: a card one step lighter than the chat, with an optional accent bar.
export function DiscordContainer({
  accent,
  spoiler,
  className,
  children,
}: {
  accent?: string | boolean;
  spoiler?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const accentColor =
    accent === true ? "var(--color-discord-blurple)" : accent || undefined;
  const card = (
    <div
      className={cn(
        "discord-container relative grid min-w-0 gap-2 overflow-hidden rounded-lg border border-discord-hairline bg-discord-card p-4",
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

  return spoiler ? <SpoilerCover>{card}</SpoilerCover> : card;
}

/// A Text Display: `h1`–`h3` stand for `#`–`###`, `small` for `-#` and `blockquote` for `>`.
export function DiscordText({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("discord-markdown", className)}>{children}</div>;
}

/// A Section: up to three Text Displays beside an accessory that always sits at the top;
/// the text centres against a button and stays at the top beside a thumbnail.
export function DiscordSection({
  accessory,
  children,
}: {
  accessory: ReactNode;
  children: ReactNode;
}) {
  const thumbnail =
    isValidElement(accessory) && accessory.type === DiscordThumbnail;

  return (
    <div className="flex justify-between gap-3">
      <div
        className={cn(
          "grid min-w-0 flex-1 gap-1",
          thumbnail ? "self-start" : "self-center",
        )}
      >
        {children}
      </div>
      <div className="flex max-w-[calc(50%-12px)] shrink-0 self-start">
        {accessory}
      </div>
    </div>
  );
}

function AltBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-1 left-[4.5px] rounded bg-black/60 leading-[18px] font-semibold text-white opacity-0 group-hover:opacity-100",
        small ? "px-1 text-xs" : "px-2 py-[7px] text-sm",
      )}
    >
      ALT
    </span>
  );
}

export function DiscordThumbnail({
  src,
  description,
  spoiler,
}: {
  src: string;
  description?: string;
  spoiler?: boolean;
}) {
  const image = (
    <span className="group relative block size-[85px] overflow-hidden rounded-lg">
      <img
        src={src}
        alt={description ?? ""}
        className="size-full object-cover"
      />
      {description ? <AltBadge small /> : null}
    </span>
  );

  return spoiler ? <SpoilerCover>{image}</SpoilerCover> : image;
}

export interface MediaItem {
  src: string;
  description?: string;
  spoiler?: boolean;
}

function MediaTile({
  item,
  className,
}: {
  item: MediaItem;
  className?: string;
}) {
  const tile = (
    <div className={cn("group relative overflow-hidden", className)}>
      <img
        src={item.src}
        alt={item.description ?? ""}
        className="size-full object-cover"
      />
      {item.description ? <AltBadge /> : null}
    </div>
  );

  return item.spoiler ? (
    <SpoilerCover className={cn("rounded-none", className)}>{tile}</SpoilerCover>
  ) : (
    tile
  );
}

/// A Media Gallery laid out by count the way Discord does: one to four in fixed grids,
/// five and up as a top row picked by the count modulo 3 over a grid of squares.
export function DiscordGallery({ items }: { items: MediaItem[] }) {
  const shown = items.slice(0, 10);
  const [first] = shown;

  if (shown.length === 1 && first) {
    return (
      <div className="group relative w-fit max-w-full overflow-hidden rounded-lg">
        <img
          src={first.src}
          alt={first.description ?? ""}
          className="block max-h-[350px] w-auto max-w-full"
        />
        {first.description ? <AltBadge /> : null}
      </div>
    );
  }

  const pair = (pairItems: MediaItem[]) => (
    <div className="grid grid-cols-2 gap-1">
      {pairItems.map((item) => (
        <MediaTile
          key={item.src}
          item={item}
          className="aspect-square max-h-[280px]"
        />
      ))}
    </div>
  );
  const lead = shown.length % 3;
  const [banner] = shown;

  return (
    <div className="flex w-[600px] max-w-full flex-col gap-1 overflow-hidden rounded-lg">
      {shown.length === 2 ? pair(shown) : null}
      {shown.length === 3 || shown.length === 4 ? (
        <div
          className={cn(
            "grid aspect-[600/350] grid-rows-2 gap-1",
            shown.length === 3 ? "grid-cols-[2fr_1fr]" : "grid-cols-2",
          )}
        >
          {shown.map((item, index) => (
            <MediaTile
              key={item.src}
              item={item}
              className={
                shown.length === 3 && index === 0 ? "row-span-2" : undefined
              }
            />
          ))}
        </div>
      ) : null}
      {shown.length >= 5 ? (
        <>
          {lead === 1 && banner ? (
            <MediaTile item={banner} className="aspect-[600/280]" />
          ) : null}
          {lead === 2 ? pair(shown.slice(0, 2)) : null}
          <div className="grid grid-cols-3 gap-1">
            {shown.slice(lead).map((item) => (
              <MediaTile key={item.src} item={item} className="aspect-square" />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

const ARCHIVE = /\.(zip|rar|7z|tar|gz)$/i;

/// A File component: the attachment card with its type illustration, name and size.
export function DiscordFile({
  name,
  size,
  spoiler,
}: {
  name: string;
  size: string;
  spoiler?: boolean;
}) {
  const card = (
    <div className="group relative flex w-[432px] max-w-full items-center rounded-lg border border-discord-hairline bg-discord-card p-4 shadow-[0_1px_4px_rgb(0_0_0/0.14)]">
      <FileIllustration
        archive={ARCHIVE.test(name)}
        className="mr-2 h-10 w-[30px] shrink-0"
      />
      <div className="min-w-0">
        <span className="block cursor-pointer truncate text-base leading-5 text-discord-link hover:underline">
          {name}
        </span>
        <span className="block text-xs leading-4 text-discord-muted">
          {size}
        </span>
      </div>
      <span className="absolute -top-2 -right-2 flex rounded-[5px] bg-discord-chip opacity-0 outline outline-discord-bg group-hover:opacity-100">
        <span className="flex size-8 cursor-pointer items-center justify-center rounded-[5px] text-discord-subtle hover:bg-discord-hover hover:text-discord-strong">
          <DownloadIcon className="size-5" />
        </span>
      </span>
    </div>
  );

  return spoiler ? (
    <SpoilerCover hide="conceal" className="w-[432px] max-w-full">
      {card}
    </SpoilerCover>
  ) : (
    card
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
  | "link"
  | "premium";

export function DiscordButton({
  variant = "secondary",
  size,
  emoji,
  disabled,
  loading,
  pressed,
  onClick,
  className,
  children,
}: {
  variant?: DiscordButtonVariant;
  /** `md` is the modal footer's new-style button; messages use the small one. */
  size?: "md";
  emoji?: string;
  disabled?: boolean;
  /** Waiting for the bot to answer the click. */
  loading?: boolean;
  /** Holds the pressed look, for a demo that shows where a click lands. */
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  const content = (
    <>
      {variant === "premium" ? (
        <ShopIcon className="mr-1 size-4 shrink-0" />
      ) : null}
      {emoji ? (
        <AppEmoji
          name={emoji}
          className={cn("size-[1.375em] shrink-0", children ? "mr-1" : null)}
        />
      ) : null}
      {children ? <span className="truncate">{children}</span> : null}
      {variant === "link" ? (
        <ExternalLinkIcon className="ml-2 size-4 shrink-0" />
      ) : null}
      {loading ? <ThinkingDots /> : null}
    </>
  );
  const look = {
    className: cn("discord-button", onClick && "cursor-pointer", className),
    "data-variant": variant,
    "data-size": size,
    "data-pressed": pressed ? "" : undefined,
    "data-loading": loading ? "" : undefined,
    "aria-disabled": disabled || undefined,
  };

  if (!onClick) {
    return <span {...look}>{content}</span>;
  }

  return (
    <button type="button" {...look} onClick={disabled ? undefined : onClick}>
      {content}
    </button>
  );
}

/// The status line under a message: the bot thinking, or the interaction having failed.
export function DiscordInteractionStatus({
  failed,
  children,
}: {
  failed?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-1 flex items-center gap-2 text-base leading-5",
        failed ? "text-discord-danger-text" : "text-discord-text",
      )}
    >
      {failed ? (
        <AlertCircleIcon className="size-4 shrink-0" />
      ) : (
        <ThinkingDots />
      )}
      <span>{children}</span>
    </div>
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
        <span className="text-xl font-semibold text-discord-strong">{title}</span>
        <X className="ms-auto size-5 text-discord-muted" />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-2">
            <div>
              <p className="m-0 text-base font-semibold text-discord-strong">
                {field.label}
              </p>
              {field.description ? (
                <p className="m-0 text-discord-muted">{field.description}</p>
              ) : null}
            </div>
            <div
              className={cn(
                "flex justify-between gap-2 rounded-lg border border-discord-border bg-discord-field px-3 py-2.5 text-base whitespace-pre-line",
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
                <ChevronIcon className="size-[18px] shrink-0 text-discord-text" />
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
