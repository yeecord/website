import type { Locale } from "~/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { commandName } from "./command-name";

export function createCmd(locale: Locale) {
  return function Cmd({ name }: { name: string }) {
    const display = commandName(name, locale);

    if (display === name) {
      return <code>/{name}</code>;
    }

    const label = locale === "zh-cn" ? "在 Discord 中显示为" : "在 Discord 中顯示為";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <code className="cursor-help underline decoration-dotted" />
            }
          >
            /{name}
          </TooltipTrigger>
          <TooltipContent>
            {label}「/{display}」
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
}
