import { HomePage } from "~/home/page";

export default function Home() {
  return <HomePage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
