"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CheckboxMark,
  ChevronIcon,
  CrossIcon,
  SelectedIcon,
  ThinkingDots,
} from "~/components/mdx/discord-icons";
import { cn } from "~/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  description?: ReactNode;
  /** A string select option's emoji. */
  emoji?: ReactNode;
  /** A user, role or channel option's 24px avatar or icon. */
  icon?: ReactNode;
  /** Grey detail after the label, such as a role's member count. */
  meta?: ReactNode;
  default?: boolean;
}

/** String selects list the bot's own options; the others list the server's users, roles and channels. */
export type SelectKind = "string" | "user" | "role" | "mentionable" | "channel";

const VISIBLE_OPTIONS = 5;

/// A select menu, collapsed or open: a field holding the placeholder, the picked value or
/// chips for each pick, and below it the options with Discord's tick or checkbox marks.
export function DiscordSelect({
  kind = "string",
  placeholder,
  options = [],
  value,
  max = 1,
  open,
  disabled,
  loading,
  block,
  onChange,
}: {
  kind?: SelectKind;
  placeholder: string;
  options?: SelectOption[];
  /** The picked values; left out, the select tracks its own, starting from the `default` options. */
  value?: string[];
  max?: number;
  /** Holds the menu open or shut; left out, a click toggles it. */
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Fills the width, as inside a modal. */
  block?: boolean;
  onChange?: (values: string[]) => void;
}) {
  const [own, setOwn] = useState(() =>
    options.filter((option) => option.default).map((option) => option.value),
  );
  const [toggled, setToggled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<DOMRect>();
  const picked = value ?? own;
  const expanded = open ?? toggled;
  const interactive = open === undefined && !disabled && !loading;
  const multiple = max > 1;
  const full = multiple && picked.length >= max;
  const chosen = options.filter((option) => picked.includes(option.value));

  useEffect(() => {
    if (!toggled) {
      return;
    }

    function close(event: Event) {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : event.target instanceof Node &&
            !root.current?.contains(event.target) &&
            !menu.current?.contains(event.target)
      ) {
        setToggled(false);
      }
    }

    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);

    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [toggled]);

  // The menu is portalled so a container's clipping cannot cut it, and follows the field
  useLayoutEffect(() => {
    if (!expanded) {
      return;
    }

    function place() {
      setAnchor(root.current?.getBoundingClientRect());
    }

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);

    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [expanded]);

  function pick(option: SelectOption) {
    const has = picked.includes(option.value);
    let next: string[];

    if (!multiple) {
      next = [option.value];
      setToggled(false);
    } else if (has) {
      next = picked.filter((item) => item !== option.value);
    } else if (full) {
      return;
    } else {
      next = [...picked, option.value];
    }

    setOwn(next);
    onChange?.(next);
  }

  const optionHeight = (option: SelectOption) =>
    kind === "string" ? (option.description ? 56 : 38) : 44;
  const menuHeight =
    options
      .slice(0, VISIBLE_OPTIONS)
      .reduce((sum, option) => sum + optionHeight(option), 0) + 2;
  const anyEmoji = options.some((option) => option.emoji);
  const checkboxes = multiple && kind !== "string";

  return (
    <div
      ref={root}
      className={cn(
        "relative font-discord",
        block ? "w-full" : "w-[400px] max-w-full",
      )}
    >
      <div
        role="combobox"
        aria-expanded={expanded}
        aria-disabled={disabled || undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={
          interactive ? () => setToggled((current) => !current) : undefined
        }
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setToggled((current) => !current);
                }
              }
            : undefined
        }
        className={cn(
          "flex min-h-11 w-full items-center gap-2 rounded-lg border bg-discord-field py-2 pr-2 pl-3 outline-none",
          expanded
            ? "border-discord-blurple shadow-[inset_0_0_0_1px_var(--color-discord-blurple)]"
            : "border-discord-border",
          interactive && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {chosen.length === 0 ? (
            <span className="truncate text-base leading-5 text-discord-subtle">
              {placeholder}
            </span>
          ) : multiple ? (
            chosen.map((option) => (
              <Chip key={option.value} kind={kind} option={option} />
            ))
          ) : (
            chosen.map((option) => (
              <span
                key={option.value}
                className="flex min-w-0 items-center gap-2 text-base leading-5 font-medium text-discord-text"
              >
                {option.emoji ? <Emoji size={22}>{option.emoji}</Emoji> : null}
                <span className="truncate">{option.label}</span>
              </span>
            ))
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-discord-text">
          {loading ? (
            <ThinkingDots />
          ) : (
            <ChevronIcon up={expanded} className="size-[18px]" />
          )}
        </span>
      </div>
      {expanded && anchor
        ? createPortal(
            <div
              ref={menu}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              className="fixed z-50 overflow-y-auto rounded-lg border border-discord-hairline bg-discord-popover font-discord text-discord-text [scrollbar-width:thin]"
              style={{
                top: anchor.bottom + 8,
                left: anchor.left,
                width: anchor.width,
                maxHeight: menuHeight,
              }}
            >
              {options.map((option) => {
                const selected = picked.includes(option.value);
                const blocked = full && !selected;

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={blocked || undefined}
                    onClick={interactive ? () => pick(option) : undefined}
                    className={cn(
                      "group flex items-center gap-2",
                      kind === "string" ? "p-2" : "px-3 py-2.5",
                      selected && !checkboxes
                        ? "bg-discord-selected"
                        : "hover:bg-discord-hover",
                      interactive && !blocked && "cursor-pointer",
                      blocked &&
                        (kind === "string" ? "opacity-60" : "opacity-50"),
                    )}
                  >
                    {kind === "string" ? (
                      <>
                        {anyEmoji ? (
                          <Emoji size={22}>{option.emoji}</Emoji>
                        ) : null}
                        <span className="min-w-0 flex-1 self-start text-sm leading-[18px]">
                          <span className="block truncate font-bold text-discord-strong">
                            {option.label}
                          </span>
                          {option.description ? (
                            <span className="mt-1 block truncate text-discord-subtle">
                              {option.description}
                            </span>
                          ) : null}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex size-6 shrink-0 items-center justify-center">
                          {option.icon}
                        </span>
                        <span
                          className={cn(
                            "flex min-w-0 flex-1 items-center gap-1 text-base leading-5",
                            selected
                              ? "font-medium text-discord-strong"
                              : "text-discord-subtle group-hover:text-discord-strong",
                          )}
                        >
                          <span className="truncate">{option.label}</span>
                          {option.meta ? (
                            <span className="flex shrink-0 items-center gap-1 font-normal text-discord-muted">
                              {option.meta}
                            </span>
                          ) : null}
                        </span>
                      </>
                    )}
                    <span className="flex size-5 shrink-0 items-center justify-center">
                      {checkboxes ? (
                        <CheckboxMark checked={selected} />
                      ) : selected ? (
                        <SelectedIcon className="size-5" />
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function Emoji({ size, children }: { size: number; children: ReactNode }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center leading-none"
      style={{ width: size, height: size, fontSize: size * 0.9 }}
    >
      {children}
    </span>
  );
}

/// A multi-select pick in the field: an emoji and label for string selects, an icon,
/// name and remove cross for the others.
function Chip({ kind, option }: { kind: SelectKind; option: SelectOption }) {
  if (kind === "string") {
    return (
      <span className="inline-flex max-w-[230px] items-center rounded-[3px] bg-discord-chip px-2 py-1.5 text-sm leading-5 font-medium text-discord-strong">
        {option.emoji ? (
          <span className="mr-2">
            <Emoji size={16}>{option.emoji}</Emoji>
          </span>
        ) : null}
        <span className="truncate">{option.label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex max-w-[230px] items-center gap-1 rounded border border-discord-faint bg-discord-chip px-2 py-1 text-sm leading-5 font-medium text-discord-strong">
      {option.icon ? (
        <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-full [&>*]:size-4">
          {option.icon}
        </span>
      ) : null}
      <span className="truncate">{option.label}</span>
      <CrossIcon className="size-4 shrink-0 text-discord-subtle" />
    </span>
  );
}
