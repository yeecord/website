import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "@/components/Footer";
import { footer, domain } from "@config";
import { InvitePicker } from "@/components/invite/picker";
import { baseOptions } from "@/layout-config";

const TITLE = "邀請 YEE 式機器龍";
const DESCRIPTION =
  "自由勾選要授予機器龍的權限，或是安裝到自己的帳號上到處使用。";

export default function InvitePage() {
  return (
    <HomeLayout {...baseOptions}>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={`${domain}/invite`} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <main className="mx-auto w-full max-w-4xl px-4 py-16">
        <h1 className="text-center font-bold text-4xl">快來把我帶回家！</h1>
        <p className="mt-4 mb-10 text-center text-fd-muted-foreground">
          勾選你需要的功能，機器龍只會拿走該拿的權限
        </p>
        <InvitePicker />
      </main>
      <Footer categories={footer} />
    </HomeLayout>
  );
}

export function getConfig() {
  return {
    render: "static",
  } as const;
}
