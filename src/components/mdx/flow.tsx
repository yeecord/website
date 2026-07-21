"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function useLoop(steps: number, interval = 3200) {
  const [step, setStep] = useState(0);

  // setTimeout keyed on step so picking a dot restarts the full interval
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((current) => (current + 1) % steps);
    }, interval);

    return () => clearTimeout(timer);
  }, [step, steps, interval]);

  return [step, setStep] as const;
}

export function StepDots({
  labels,
  step,
  onPick,
}: {
  labels: string[];
  step: number;
  onPick: (index: number) => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      {labels.map((title, index) => (
        <button
          key={title}
          type="button"
          onClick={() => onPick(index)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs transition-colors duration-300",
            index === step
              ? "bg-discord-blurple text-white"
              : "bg-discord-embed text-discord-muted hover:text-discord-text",
          )}
        >
          {index + 1}. {title}
        </button>
      ))}
    </div>
  );
}

export function Scene({ children, id }: { children: React.ReactNode; id: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ClickHint({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn("pointer-events-none absolute text-white", className)}
      animate={{ scale: [1, 0.82, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      <MousePointer2 className="size-4 drop-shadow" />
    </motion.span>
  );
}

export function FlowFrame({
  labels,
  step,
  onPick,
  caption,
  children,
  minHeightClass = "min-h-44",
}: {
  labels: string[];
  step: number;
  onPick: (index: number) => void;
  caption: string;
  children: React.ReactNode;
  minHeightClass?: string;
}) {
  return (
    <div className="not-prose my-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
      <StepDots labels={labels} step={step} onPick={onPick} />
      <div className={minHeightClass}>{children}</div>
      <p className="mt-3 text-xs text-discord-muted">{caption}</p>
    </div>
  );
}
