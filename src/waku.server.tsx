import { createRouter } from "fumapress/router";
import { fsRouterFn } from "fumapress/router/fs";
import _adapter from "waku/adapters/cloudflare";

import pressConfig from "../press.config";

const modules = import.meta.glob("./pages/**/*.{ts,tsx,js,jsx}", {
  base: "/src",
});

const router = await createRouter(pressConfig);
const pages = router.createPages(fsRouterFn(modules));
const middlewareFns = router.createMiddlewares();
const adapter = router.patchAdapter(_adapter);

export default adapter(pages, { middlewareFns, static: true });
