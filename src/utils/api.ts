import { getAll } from "@vercel/edge-config";

export async function fetchGuild() {
  const config = await getAll<{
    guilds: number;
    members: number;
  }>(["guilds", "members"]);

  return {
    serverMembers: config?.members || 10000,
    guildCount: config?.guilds || 100_000,
  } as const;
}
