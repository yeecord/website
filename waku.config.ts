import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import press from "fumapress/vite";
import { defineConfig } from "waku/config";

export default defineConfig({
  vite: {
    // Waku bakes a random WAKU_BUILD_ID per build; the client reloads whenever a
    // fetched RSC's _buildId differs from the client bundle's. During a Cloudflare
    // Pages deploy the edge briefly mixes old/new bundles + RSC, so the mismatch
    // fires an endless reload loop. Pinning it to a constant kills the mismatch;
    // a genuinely missing chunk still self-heals once via vite:preloadError.
    // ponytail: constant means stale tabs never force-reload, fine for a content
    // site; for a precise single reload pass onBuildIdMismatch to the Router.
    define: {
      "import.meta.env.WAKU_BUILD_ID": JSON.stringify("yeecord"),
    },
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    resolve: {
      tsconfigPaths: true,
      dedupe: ["fumadocs-ui", "fumadocs-core"],
    },
    plugins: [press(), mdx(), tailwindcss()],
  },
});
