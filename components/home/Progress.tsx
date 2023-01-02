import { twMerge } from "tailwind-merge";

export function Progress({ track }: { track: string }) {
  return (
    <div className="w-full h-[12px] overflow-hidden rounded-full">
      <div
        className={twMerge(
          "h-full bg-gradient-to-r from-green-500 to-cyan-400",
          track
        )}
      />
    </div>
  );
}
