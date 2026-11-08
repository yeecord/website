import type { AppShape, Plugin } from "fumapress";
import { ImageResponse } from "takumi-js/response";
import wasmModule from "takumi-js/wasm";
import { ogFonts, SiteBanner } from "./og-image";

/** 站台總 banner 改成 build 時生成，路徑沿用原本的靜態檔 */
export function ogPlugin<C extends AppShape>(): Plugin<C> {
  return {
    name: "og-banner",
    routes({ createApi }) {
      createApi({
        render: "static",
        path: "/opengraph-image.png",
        GET: () =>
          new ImageResponse(<SiteBanner />, {
            width: 1200,
            height: 630,
            format: "png",
            fonts: ogFonts,
            module: wasmModule,
          }),
      });
    },
  };
}
