import { Community } from "@/home/Community";
import { Customers } from "@/home/Customers";
import { Hero } from "@/home/Hero";
import { RpgSystem } from "@/home/RpgSystem";
import { Features } from "@/home/features";
import Sponsor from "@/home/Sponsor";
import { fetchGuild } from "@/utils/api";

export const revalidate = 60;

export default async function HomePage() {
  const { guildCount, serverMembers } = await fetchGuild().catch(() => ({
    guildCount: 0,
    serverMembers: 0,
  }));

  return (
    <main className="overflow-x-clip">
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
