import type { LoaderPlugin } from "fumadocs-core/source";

// 側欄頁面對應的斜線指令，slug 即指令名；一頁多指令的（utility）不標
const sidebarCommands = new Set([
  "poll",
  "auto-role",
  "role-menu",
  "form",
  "giveaway",
  "auto-channels",
  "lock-channel",
  "member-notification",
  "clear",
  "bot-fight",
  "lol",
  "find-food",
]);

export function sidebarCommandsPlugin(): LoaderPlugin {
  return {
    name: "sidebar-commands",
    transformPageTree: {
      file(node) {
        const slug = node.url.replace(/\/$/, "").split("/").at(-1);

        if (
          !node.url.includes("/docs/") ||
          !slug ||
          !sidebarCommands.has(slug)
        ) {
          return node;
        }

        return {
          ...node,
          name: (
            <>
              {node.name}
              <code className="ms-auto rounded bg-fd-muted px-1.5 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
                /{slug}
              </code>
            </>
          ),
        };
      },
    },
  };
}
