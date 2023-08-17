import { Community } from "@/src/home/Community";
import { Customers } from "@/src/home/Customers";
import { Hero } from "@/src/home/Hero";
import { RpgSystem } from "@/src/home/RpgSystem";
import { Features } from "@/src/home/features";
import Sponsor from "@/src/home/Sponsor";
import { fetchGuild } from "@utils/api";

export const revalidate = 60;

export default async function HomePage() {
  const { guildCount, serverMembers } = await fetchGuild().catch(() => ({
    guildCount: 0,
    serverMembers: 0,
  }));

  return (
    <main className="w-0 flex-1">
      <div className="mx-auto flex max-w-[1400px] flex-col px-3 md:px-6">
        <Hero />
        <Features />
        <RpgSystem />
        <Customers usedBy={guildCount} />
      </div>
      <Sponsor />
      <Community joined={serverMembers} />
    </main>
  );
}
