"use client";

import { motion, useReducedMotion } from "motion/react";
import { MousePointer2 } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { DiscordSurface } from "~/components/mdx/discord";
import { cn } from "~/utils/cn";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** How long before a step ends the hinted button shows as pressed. */
const PRESS_LEAD = 360;

/// Cycles `steps` every `interval` ms; `pressing` turns on just before each advance.
export function useLoop(steps: number, interval = 3200) {
  const [step, setStep] = useState(0);
  const [pressing, setPressing] = useState(false);

  // setTimeout keyed on step so picking a dot restarts the full interval
  useEffect(() => {
    setPressing(false);

    const press = setTimeout(
      () => setPressing(true),
      Math.max(interval - PRESS_LEAD, 0),
    );
    const advance = setTimeout(() => {
      setStep((current) => (current + 1) % steps);
    }, interval);

    return () => {
      clearTimeout(press);
      clearTimeout(advance);
    };
  }, [step, steps, interval]);

  return [step, setStep, pressing] as const;
}

const PressingContext = createContext(false);

/// Whether the flow around this component is about to press its hinted button.
export function usePressing() {
  return useContext(PressingContext);
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
            "rounded-full px-2.5 py-1 text-xs transition-colors duration-200",
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

/// One screen of a flow, for a step that swaps the whole view rather than adding a message.
export function Scene({ children, id }: { children: ReactNode; id: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.24, ease: EASE_OUT },
      }}
      exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
    >
      {children}
    </motion.div>
  );
}

/// A message arriving in the chat: a short rise and fade, never a scale.
export function MessageEnter({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ClickHint({ className }: { className?: string }) {
  const pressing = usePressing();
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={cn("pointer-events-none absolute text-white", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: pressing && !reduce ? 0.85 : 1 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
    >
      <MousePointer2 className="size-4 drop-shadow" />
    </motion.span>
  );
}

export function FlowFrame({
  labels,
  step,
  onPick,
  pressing = false,
  caption,
  children,
  minHeightClass = "min-h-44",
}: {
  labels: string[];
  step: number;
  onPick: (index: number) => void;
  pressing?: boolean;
  caption: string;
  children: ReactNode;
  minHeightClass?: string;
}) {
  return (
    <DiscordSurface className="text-sm">
      <StepDots labels={labels} step={step} onPick={onPick} />
      <PressingContext.Provider value={pressing}>
        <div className={minHeightClass}>{children}</div>
      </PressingContext.Provider>
      <p className="mt-3 text-xs text-discord-muted">{caption}</p>
    </DiscordSurface>
  );
}
