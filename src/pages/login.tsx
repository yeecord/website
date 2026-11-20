import { LoginPage } from "~/login/page";

export default function Login() {
  return <LoginPage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
