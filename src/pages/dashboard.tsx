import { DashboardPage } from "~/dashboard/page";

export default function Dashboard() {
  return <DashboardPage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
