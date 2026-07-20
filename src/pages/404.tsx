import { DefaultNotFound } from "fumadocs-ui/layouts/home/not-found";

// i18n 模式下 fumapress 只產生 /[lang]/404，Cloudflare Pages 需要根目錄的 404.html
export default function NotFoundPage() {
  return <DefaultNotFound />;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
