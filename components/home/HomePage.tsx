import { Community } from "./Community";
import { Customers } from "./Customers";
import { Hero } from "./Hero";
import { Music } from "./Music";
import { Powerful } from "./Powerful";
import { RpgSystem } from "./RpgSystem";
import { Inter } from "@next/font/google";
import clsx from "clsx";

export type HomeProps = {
  serverMembers: number;
  usedBy: number;
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function HomePage(props: HomeProps) {
  return (
    <div className={clsx("bg-white dark:bg-black font-sans", inter.variable)}>
      <div className="flex flex-col relative px-3 md:px-6 max-w-[1400px] mx-auto">
        <Hero />
        <Music />
        <Powerful />
        <RpgSystem />
        <Customers usedBy={props.usedBy} />
      </div>
      <Community joined={props.serverMembers} />
    </div>
  );
}
