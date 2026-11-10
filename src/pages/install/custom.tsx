import { InstallCustomPage } from "~/install/custom";

export default function InstallCustom() {
  return <InstallCustomPage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
