import type { ServerPlugin } from "fumapress";
import { ImageResponse } from "takumi-js/response";
import wasmModule from "takumi-js/wasm";
import type { PressContext } from "../press.config";
import { ogFonts, SiteBanner } from "./og-image";

/** 站台總 banner 改成 build 時生成，路徑沿用原本的靜態檔 */
export function ogPlugin(): ServerPlugin<PressContext> {
  return {
    name: "og-banner",
    createPages({ createApiIsomorphic }) {
      createApiIsomorphic({
        render: "static",
        path: "/opengraph-image.png",
        handler: async () =>
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
