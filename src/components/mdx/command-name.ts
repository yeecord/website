import type { Locale } from "~/i18n";
import { SLASH_NAMES } from "./slash-names";

// The docs page for /auto-roles has the slug auto-role
const ALIASES: Record<string, string> = { "auto-role": "auto-roles" };

// The night-market game has not shipped, so the generated table does not have it yet
const UPCOMING: typeof SLASH_NAMES = {
  stall: { "zh-tw": "攤位", "zh-cn": "摊位" },
};

function lookup(path: string, locale: Locale) {
  if (locale === "en") {
    return undefined;
  }

  const key = ALIASES[path] ?? path;

  return (SLASH_NAMES[key] ?? UPCOMING[key])?.[locale];
}

/** How Discord shows a command in `locale`: "poll create" is "投票 發起投票" in zh-tw. */
export function commandName(path: string, locale: Locale) {
  const parts = path.split(" ");

  return parts
    .map(
      (part, index) =>
        lookup(parts.slice(0, index + 1).join(" "), locale) ?? part,
    )
    .join(" ");
}

/** An option's name in `locale`, looked up under its command first, then under each parent. */
export function optionName(command: string, option: string, locale: Locale) {
  const parts = command.split(" ");

  for (let length = parts.length; length > 0; length--) {
    const name = lookup(`${parts.slice(0, length).join(" ")} ${option}`, locale);

    if (name) {
      return name;
    }
  }

  return option;
}
