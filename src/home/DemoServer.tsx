"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRightIcon,
  HashIcon,
  PlusCircleIcon,
  Volume2Icon,
} from "lucide-react";
import { createContext, type ReactNode, useContext, useRef, useState } from "react";
import {
  DiscordButton,
  DiscordContainer,
  DiscordMessage,
  DiscordRow,
  DiscordStatus,
  DiscordText,
  Interpolate,
  Mention,
  Timestamp,
} from "~/components/mdx/discord";
import { commandName } from "~/components/mdx/command-name";
import { EASE_OUT, MessageEnter } from "~/components/mdx/flow";
import { defaultLocale, type Locale } from "~/i18n";
import { type Phrase, type Translate, translator } from "~/i18n/translate";
import { burst } from "./burst";
import { type ChannelId, channels } from "./channels";

const BOT_NAME: Phrase = "YEE式機器龍";

const LocaleContext = createContext<{ locale: Locale; t: Translate }>({
  locale: defaultLocale,
  t: translator(defaultLocale),
});

function useT() {
  return useContext(LocaleContext).t;
}

/** One channel of the demo server in its own Discord window, with buttons that answer. */
export function DemoChannel({ locale, id }: { locale: Locale; id: ChannelId }) {
  const t = translator(locale);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-discord-bg font-discord shadow-2xl shadow-black/30">
        <div className="flex items-center gap-2 border-white/8 border-b px-4 py-3 text-discord-text">
          {id === "voice" ? (
            <Volume2Icon aria-hidden className="size-5 text-discord-muted" />
          ) : (
            <HashIcon aria-hidden className="size-5 text-discord-muted" />
          )}
          <span className="font-semibold text-white">{t(channels[id].name)}</span>
        </div>
        <div className="flex min-h-[22rem] flex-col gap-4 p-4 text-discord-text text-sm">
          {id === "welcome" && <WelcomeScene />}
          {id === "lottery" && <LotteryScene />}
          {id === "voice" && <VoiceScene />}
          {id === "voice" ? null : (
            <div className="mt-auto flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5 text-discord-placeholder">
              <PlusCircleIcon aria-hidden className="size-5 shrink-0" />
              {t("跟大家說點什麼…")}
            </div>
          )}
        </div>
      </div>
    </LocaleContext.Provider>
  );
}

function Msg({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <MessageEnter delay={delay} className="flex flex-col gap-4">
      {children}
    </MessageEnter>
  );
}

function useChrome() {
  const { locale, t } = useContext(LocaleContext);

  return {
    time: t("今天 21:30"),
    ephemeral: { note: t("只有你看得到這則訊息"), dismiss: t("關閉訊息") },
    command: (user: Phrase, path: string) => ({
      user: t(user),
      name: commandName(path, locale),
      used: t("使用了"),
    }),
  };
}

const roles: Phrase[] = ["🎮 遊戲仔", "🌙 夜貓子", "🎨 創作者"];

const roleColors: Record<string, string> = {
  "🎮 遊戲仔": "#5ab4f0",
  "🌙 夜貓子": "#c79bf2",
  "🎨 創作者": "#f0a35a",
};

function WelcomeScene() {
  const t = useT();
  const chrome = useChrome();
  const [held, setHeld] = useState<Phrase[]>([]);
  const [reply, setReply] = useState<{ role: Phrase; added: boolean }>();

  function press(role: Phrase) {
    const added = !held.includes(role);

    setHeld((current) =>
      added ? [...current, role] : current.filter((r) => r !== role),
    );
    setReply({ role, added });
  }

  return (
    <>
      <Msg delay={0}>
        <DiscordMessage author={t(BOT_NAME)} bot time={chrome.time}>
          <DiscordContainer accent>
            <DiscordText>
              <p>{t("歡迎來到 Yeecord 示範伺服器！")}</p>
              <p>{t("點下方選項獲得身分組")}</p>
            </DiscordText>
            <DiscordText>
              <small>{t("再按一次可以移除")}</small>
            </DiscordText>
            <DiscordRow>
              {roles.map((role) => (
                <DiscordButton key={role} onClick={() => press(role)}>
                  {t(role)}
                </DiscordButton>
              ))}
            </DiscordRow>
          </DiscordContainer>
        </DiscordMessage>
      </Msg>
      <Msg delay={0.2}>
        <p className="flex items-center gap-4 text-discord-muted">
          <ArrowRightIcon className="mx-3 size-4 text-discord-green" />
          {t("阿龍的粉絲 剛剛加入伺服器 👋")}
        </p>
      </Msg>
      <Msg delay={0.4}>
        <DiscordMessage author={t(BOT_NAME)} bot time={chrome.time}>
          <DiscordText>
            <p>
              <Interpolate
                text={t(
                  "歡迎 {member} 加入伺服器！先在上面挑個身分組，讓大家認識你 🎉",
                )}
                values={{ member: <Mention>@{t("阿龍的粉絲")}</Mention> }}
              />
            </p>
          </DiscordText>
        </DiscordMessage>
      </Msg>
      {reply ? (
        <MessageEnter key={`${reply.role}-${reply.added}`}>
          <DiscordMessage
            author={t(BOT_NAME)}
            bot
            time={chrome.time}
            ephemeral={chrome.ephemeral}
          >
            <DiscordStatus
              emoji="check"
              title={
                <>
                  {t(reply.added ? "已取得" : "已移除")}{" "}
                  <Mention color={roleColors[reply.role]}>
                    @{t(reply.role)}
                  </Mention>
                </>
              }
              notes={[
                <Interpolate
                  key="note"
                  text={t(
                    reply.added
                      ? "再按一次「{name}」可以移除"
                      : "再按一次「{name}」可以取回",
                  )}
                  values={{ name: t(reply.role) }}
                />,
              ]}
            />
            <DiscordRow>
              <DiscordButton onClick={() => press(reply.role)}>
                {t("復原")}
              </DiscordButton>
            </DiscordRow>
          </DiscordMessage>
        </MessageEnter>
      ) : null}
    </>
  );
}

const TITLE: Phrase = "Nitro 一個月";

const CONFETTI = [
  { kind: "paper", color: "var(--color-yee-green)" },
  { kind: "paper", color: "var(--color-yee-crown)" },
  { kind: "paper", color: "var(--color-discord-text)" },
  { kind: "paper", color: "var(--color-discord-blurple)" },
] as const;

function LotteryScene() {
  const t = useT();
  const chrome = useChrome();
  const [joined, setJoined] = useState(false);
  const [reply, setReply] = useState<"joined" | "already" | "left">();
  const scene = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number }>(undefined);
  const count = joined ? 43 : 42;
  const channel = <Mention>#{t("抽獎區")}</Mention>;
  const inSevenDays = <Timestamp>{t("7 天後")}</Timestamp>;

  function join() {
    const box = scene.current?.getBoundingClientRect();
    const from = pointer.current ?? (box && { x: box.left + box.width / 2, y: box.top + box.height / 3 });

    pointer.current = undefined;

    if (!joined && from) {
      burst(from.x, from.y, CONFETTI);
    }

    setReply(joined ? "already" : "joined");
    setJoined(true);
  }

  function leave() {
    setJoined(false);
    setReply("left");
  }

  const replies = {
    joined: {
      emoji: "check",
      title: "已參加「{title}」",
      note: "目前 {count} 人參加，{time}抽出 3 位得獎者，結果會公布在 {channel}",
    },
    already: {
      emoji: "info",
      title: "你已經參加「{title}」了",
      note: "{time}抽獎，目前 {count} 人參加",
    },
    left: {
      emoji: "check",
      title: "已退出「{title}」",
      note: "抽獎結束前，按「點我參加」就能重新加入",
    },
  } as const satisfies Record<
    string,
    { emoji: "check" | "info"; title: Phrase; note: Phrase }
  >;

  return (
    <div
      ref={scene}
      className="flex flex-col gap-4"
      onPointerDownCapture={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <Msg delay={0}>
        <DiscordMessage
          author={t(BOT_NAME)}
          bot
          time={chrome.time}
          command={chrome.command("阿龍", "giveaway create")}
        >
          <DiscordContainer accent>
            <DiscordText>
              <h2>{t(TITLE)}</h2>
            </DiscordText>
            <DiscordText>
              <small>
                {t("抽出 3 位得獎者")} ·{" "}
                <Interpolate
                  text={t("抽獎會在 {date} ({time}) 結束")}
                  values={{
                    date: (
                      <Timestamp>{t("2026年10月26日 星期一 21:30")}</Timestamp>
                    ),
                    time: inSevenDays,
                  }}
                />
              </small>
            </DiscordText>
            <DiscordText>
              <small>
                <Interpolate
                  text={t("目前 {count} 人參加")}
                  values={{ count }}
                />
              </small>
            </DiscordText>
            <DiscordRow>
              <DiscordButton
                variant="primary"
                emoji="party_popper"
                onClick={join}
              >
                {t("點我參加")}
              </DiscordButton>
              <DiscordButton variant="danger">{t("終止抽獎")}</DiscordButton>
            </DiscordRow>
          </DiscordContainer>
        </DiscordMessage>
      </Msg>
      {reply ? (
        <MessageEnter key={reply}>
          <DiscordMessage
            author={t(BOT_NAME)}
            bot
            time={chrome.time}
            ephemeral={chrome.ephemeral}
          >
            <DiscordStatus
              emoji={replies[reply].emoji}
              title={
                <Interpolate
                  text={t(replies[reply].title)}
                  values={{ title: t(TITLE) }}
                />
              }
              notes={[
                <Interpolate
                  key="note"
                  text={t(replies[reply].note)}
                  values={{ count, time: inSevenDays, channel }}
                />,
              ]}
            />
            {reply === "left" ? null : (
              <DiscordRow>
                <DiscordButton onClick={leave}>{t("退出抽獎")}</DiscordButton>
              </DiscordRow>
            )}
          </DiscordMessage>
        </MessageEnter>
      ) : null}
    </div>
  );
}

const voiceMembers: { name: Phrase; avatar: string }[] = [
  { name: "你", avatar: "bg-discord-blurple" },
  { name: "阿龍", avatar: "bg-yee-green" },
  { name: "阿龍的粉絲", avatar: "bg-yee-crown" },
];

function VoiceScene() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(false);

  function join() {
    setOpen(true);
    setClosed(false);
  }

  function leave() {
    setOpen(false);
    setClosed(true);
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-discord-embed p-2">
      <button
        type="button"
        onClick={join}
        disabled={open}
        className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-start text-discord-muted transition-colors hover:bg-white/5 hover:text-discord-text active:bg-white/10 focus-visible:outline-2 focus-visible:outline-discord-blurple disabled:cursor-default disabled:hover:bg-transparent"
      >
        <PlusCircleIcon aria-hidden className="size-4 shrink-0" />
        {t("建立語音頻道")}
      </button>
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-discord-muted">
        <Volume2Icon aria-hidden className="size-4 shrink-0" />
        {t("阿龍的頻道 · 3 人在聊")}
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="room"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { delay: 0.5, duration: 0.2 } }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 rounded bg-white/10 px-2 py-1.5 font-medium text-white">
              <Volume2Icon aria-hidden className="size-4 shrink-0" />
              {t("你的頻道")}
            </div>
            <ul className="flex flex-col gap-1 ps-7">
              {voiceMembers.map(({ name, avatar }, i) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.4, duration: 0.24, ease: EASE_OUT } }}
                  exit={{ opacity: 0, x: -8, transition: { delay: (voiceMembers.length - 1 - i) * 0.15, duration: 0.18 } }}
                  className="flex items-center gap-2 py-0.5 text-discord-text"
                >
                  <span className={clsx("relative size-6 rounded-full", avatar)}>
                    {i === 1 ? (
                      <span className="-inset-1 absolute animate-[talk_1.6s_ease-in-out_infinite] rounded-full border-2 border-discord-green motion-reduce:animate-none" />
                    ) : null}
                  </span>
                  {t(name)}
                </motion.li>
              ))}
            </ul>
            <div className="ps-7 pt-2">
              <DiscordButton variant="danger" onClick={leave}>
                {t("離開語音")}
              </DiscordButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {closed ? (
        <MessageEnter delay={0.8}>
          <p className="px-2 py-1.5 text-discord-muted">{t("人走光了，頻道自動收掉")}</p>
        </MessageEnter>
      ) : null}
    </div>
  );
}
