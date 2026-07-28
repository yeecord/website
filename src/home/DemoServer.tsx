"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HashIcon, PlusCircleIcon, Volume2Icon } from "lucide-react";
import { createContext, type ReactNode, useContext, useState } from "react";
import {
  DiscordEmbed,
  DiscordMessage,
  SlashCommand,
} from "~/components/mdx/discord";
import { type HomeCopy, homeCopy } from "./copy";

type DemoCopy = HomeCopy["demo"];
type ChannelId = keyof DemoCopy["channels"];

const CHANNEL_IDS: ChannelId[] = ["welcome", "lottery", "shop"];

const CopyContext = createContext<DemoCopy>(homeCopy["zh-tw"].demo);

function useCopy() {
  return useContext(CopyContext);
}

export function DemoServer({ copy }: { copy: HomeCopy }) {
  const c = copy.demo;
  const [active, setActive] = useState<ChannelId>("welcome");
  const [seen, setSeen] = useState<ChannelId[]>(["welcome"]);
  const channel = c.channels[active];

  function open(id: ChannelId) {
    setActive(id);
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <CopyContext.Provider value={c}>
      <div className="z-[2] mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            {c.heading}
          </h2>
          <p className="text-lg text-muted-foreground">{c.subheading}</p>
        </div>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="grid overflow-hidden rounded-xl border bg-discord-bg shadow-xl md:grid-cols-[15rem_1fr]"
        >
          <Sidebar active={active} seen={seen} onOpen={open} />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2 border-white/8 border-b px-4 py-3 text-discord-text">
              <HashIcon className="size-5 text-discord-muted" />
              <span className="font-semibold text-white">{channel.name}</span>
              <span className="text-discord-muted text-sm max-sm:hidden">
                {channel.topic}
              </span>
            </div>
            <ChannelTabs active={active} onOpen={open} />
            <div className="flex min-h-[21rem] flex-col p-4 text-discord-text text-sm">
              <div key={active} className="flex flex-col gap-4">
                {active === "welcome" && <WelcomeScene />}
                {active === "lottery" && <LotteryScene />}
                {active === "shop" && <ShopScene />}
              </div>
              <div className="mt-auto flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5 pt-2.5 text-discord-placeholder">
                <PlusCircleIcon className="size-5 shrink-0" />
                {c.inputPlaceholder}
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-muted-foreground">{c.note}</p>
      </div>
    </CopyContext.Provider>
  );
}

const msgIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

function Msg({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.div
      {...msgIn}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
}

function WelcomeScene() {
  const copy = useCopy();
  const c = copy.welcome;

  return (
    <>
      <Msg delay={0}>
        <p className="text-discord-muted text-xs">{c.joined}</p>
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={copy.sidebar.botName} bot>
          <DiscordEmbed title={c.embedTitle} color="var(--color-primary)">
            <p>{c.embedBody}</p>
          </DiscordEmbed>
          <RolePicker />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function LotteryScene() {
  const copy = useCopy();
  const c = copy.lottery;

  return (
    <>
      <Msg delay={0}>
        <SlashCommand
          name="lottery"
          description={c.command}
          options={[
            { name: c.prizeLabel, value: c.prize },
            { name: c.winnersLabel, value: "3" },
          ]}
        />
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={copy.sidebar.botName} bot>
          <DiscordEmbed
            title={c.embedTitle}
            color="var(--color-discord-fuchsia)"
          >
            <p>{c.embedBody}</p>
          </DiscordEmbed>
          <Lottery />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function ShopScene() {
  const copy = useCopy();
  const c = copy.shop;

  return (
    <>
      <Msg delay={0}>
        <DiscordMessage author={c.user} bot={false} color="#e8a33d">
          <p>/find-food</p>
        </DiscordMessage>
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={copy.sidebar.botName} bot>
          <DiscordEmbed title={c.embedTitle} color="var(--color-discord-gold)">
            <p>{c.embedBody}</p>
          </DiscordEmbed>
          <FindFoodButtons />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function ChatButton({
  variant = "secondary",
  selected,
  onClick,
  children,
}: {
  variant?: "primary" | "secondary" | "success";
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 font-medium text-sm text-white transition-all active:translate-y-px",
        variant === "primary" && "bg-discord-blurple hover:brightness-110",
        variant === "secondary" && "bg-discord-secondary hover:brightness-110",
        variant === "success" && "bg-discord-success hover:brightness-110",
        selected && "ring-2 ring-white/70",
      )}
    >
      {children}
    </button>
  );
}

function RolePicker() {
  const c = useCopy().welcome;
  const [picked, setPicked] = useState<string>();

  return (
    <div className="flex flex-wrap gap-1.5">
      {c.roles.map((role) => (
        <ChatButton
          key={role}
          variant={picked === role ? "primary" : "secondary"}
          selected={picked === role}
          onClick={() => setPicked(role)}
        >
          {role}
        </ChatButton>
      ))}
      <AnimatePresence>
        {picked && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="self-center text-discord-muted text-xs"
          >
            {c.claimed} {picked}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lottery() {
  const c = useCopy().lottery;
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(42);
  const [burst, setBurst] = useState(0);

  function join() {
    if (joined) return;

    setJoined(true);
    setCount((c) => c + 1);
    setBurst(Date.now());
  }

  return (
    <div className="relative flex flex-wrap gap-1.5">
      <ChatButton variant="primary" onClick={join}>
        {joined ? c.joined : c.join}
      </ChatButton>
      <ChatButton>
        {c.countPrefix}{" "}
        <motion.span
          key={count}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="inline-block font-semibold"
        >
          {count}
        </motion.span>{" "}
        {c.countSuffix}
      </ChatButton>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -34, scale: 1.4 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute left-6 select-none"
          >
            🎉
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function FindFoodButtons() {
  const c = useCopy().shop;
  const [status, setStatus] = useState<string>();

  return (
    <div className="flex flex-wrap gap-1.5">
      <ChatButton variant="primary" onClick={() => setStatus(c.huntStatus)}>
        {c.hunt}
      </ChatButton>
      <ChatButton variant="success" onClick={() => setStatus(c.cookStatus)}>
        {c.cook}
      </ChatButton>
      <ChatButton onClick={() => setStatus(c.feedStatus)}>{c.feed}</ChatButton>
      <AnimatePresence mode="wait">
        {status && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full text-discord-muted text-xs"
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChannelTabs({
  active,
  onOpen,
}: {
  active: ChannelId;
  onOpen: (id: ChannelId) => void;
}) {
  const channels = useCopy().channels;

  return (
    <div className="flex gap-1.5 border-white/8 border-b px-4 py-2 md:hidden">
      {CHANNEL_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onOpen(id)}
          className={clsx(
            "rounded-full px-3 py-1 text-sm transition-colors",
            id === active
              ? "bg-white/15 font-medium text-white"
              : "text-discord-muted",
          )}
        >
          #{channels[id].name}
        </button>
      ))}
    </div>
  );
}

function Sidebar({
  active,
  seen,
  onOpen,
}: {
  active: ChannelId;
  seen: ChannelId[];
  onOpen: (id: ChannelId) => void;
}) {
  const copy = useCopy();
  const c = copy.sidebar;

  return (
    <div className="flex flex-col border-white/8 border-r bg-discord-embed p-3 text-discord-text max-md:hidden">
      <p className="border-white/8 border-b px-2 pb-3 font-semibold text-white">
        {c.server}
      </p>
      <p className="mt-2 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {c.textChannels}
      </p>
      <div className="flex flex-col gap-0.5">
        {CHANNEL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onOpen(id)}
            className={clsx(
              "group relative flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-start transition-colors",
              id === active
                ? "bg-white/10 font-medium text-white"
                : "text-discord-muted hover:bg-white/5 hover:text-discord-text",
            )}
          >
            {!seen.includes(id) && (
              <span className="-left-2 absolute h-2 w-1 rounded-r-full bg-white" />
            )}
            <HashIcon className="size-4 shrink-0" />
            <span className="truncate">{copy.channels[id].name}</span>
            {!seen.includes(id) && (
              <span className="ms-auto size-2 rounded-full bg-discord-danger" />
            )}
          </button>
        ))}
      </div>
      <p className="mt-4 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {c.voiceChannels}
      </p>
      <div className="flex items-center gap-1.5 px-2 py-1 text-discord-muted">
        <Volume2Icon className="size-4 shrink-0" />
        {c.createVoice}
      </div>
      <div className="flex items-center gap-2 px-2 py-1 pl-7 text-discord-muted text-sm">
        <span className="size-2 rounded-full bg-discord-green" />
        {c.voiceRoom}
      </div>
      <div className="mt-auto flex items-center gap-2.5 rounded-lg bg-black/25 p-2">
        <img
          src="/img/logo.svg"
          alt=""
          className="size-8 rounded-full bg-discord-avatar p-0.5"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-medium text-sm text-white">{c.botName}</p>
          <p className="text-discord-muted text-xs">{c.botStatus}</p>
        </div>
      </div>
    </div>
  );
}
