import { Community } from "@/home/Community";
import { Customers } from "@/home/Customers";
import { Hero } from "@/home/Hero";
import { RpgSystem } from "@/home/RpgSystem";
import { Features } from "@/home/features";
import Sponsor from "@/home/Sponsor";
import type { Metadata } from "next";
import { domain } from "@config";

export const metadata: Metadata = {
  alternates: {
    canonical: domain,
  },
};

export default function HomePage() {
  return (
    <main className="overflow-x-clip">
      <div className="mx-auto flex max-w-[1400px] flex-col px-3 md:px-6">
        <Hero />
        <Features />
        <RpgSystem />
        <Customers />
      </div>
      <Sponsor />
      <Community />
    </main>
  );
}
