import type { ServerPlugin } from "fumapress";
import { switchLocale } from "@/components/locale-switch";
import type { PressContext } from "../press.config";

// 把自訂的 onLocaleChange 注入 i18n provider props，覆蓋內建切換行為
export function localeSwitchPlugin(): ServerPlugin<PressContext> {
  return {
    name: "locale-switch",
    init() {
      (this.data["core:provider"] ??= []).push((props) => {
        if (props.i18n)
          props.i18n = { ...props.i18n, onLocaleChange: switchLocale };

        return props;
      });
    },
  };
}
