import { InstallPage } from "@/install/page";

export default function Install() {
  return <InstallPage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
