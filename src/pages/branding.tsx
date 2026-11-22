import { BrandingPage } from "~/branding/page";

export default function Branding() {
  return <BrandingPage locale="zh-tw" />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
