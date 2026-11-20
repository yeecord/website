"use client";

import { useI18n } from "fumadocs-ui/contexts/i18n";
import { Languages, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Locale, localeCodes, staticPath } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";

const themes: [string, Phrase, typeof Sun][] = [
  ["light", "淺色", Sun],
  ["dark", "深色", Moon],
  ["system", "跟隨系統", Monitor],
];

/** The theme and language choices in one menu, opened by whatever `trigger` renders. */
export function PreferencesMenu({
  locale,
  trigger,
  side = "top",
}: {
  locale: Locale;
  trigger: ReactElement;
  side?: "top" | "bottom" | "right";
}) {
  const t = translator(locale);
  const { theme, setTheme } = useTheme();
  const { locales } = useI18n();
  // Swaps only the language prefix, so the page, its guild and its tab stay where they were.
  const switchTo = (value: string) => {
    const next = localeCodes.find((code) => code === value);

    if (!next) {
      return;
    }

    const { pathname, search } = window.location;
    const [, first = "", ...rest] = pathname.split("/");
    const page = localeCodes.some((code) => code === first) ? `/${rest.join("/")}` : pathname;

    window.location.assign(`${staticPath(next, page === "/" ? "" : page)}${search}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent side={side} align="end" sideOffset={6} className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("主題")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            {themes.map(([value, label, Icon]) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {t(label)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        {locales && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("語言")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={locale} onValueChange={switchTo}>
                {locales.map((item) => (
                  <DropdownMenuRadioItem key={item.locale} value={item.locale}>
                    <Languages />
                    {item.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
