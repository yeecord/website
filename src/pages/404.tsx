// i18n 模式下 fumapress 只產生 /[lang]/404，Cloudflare 需要根目錄的 404.html
export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <title>找不到頁面 - Yeecord</title>
      <img src="/img/logo.svg" alt="" width={90} height={120} />
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">404</h1>
        <p className="text-fd-muted-foreground">
          這個頁面不見了，可能被機器龍吃掉了。
        </p>
      </div>
      <a href="/" className="btn-chunky">
        回首頁
      </a>
    </main>
  );
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
