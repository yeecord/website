"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import {
  ArrowRightIcon,
  HashIcon,
  PlusCircleIcon,
  Volume2Icon,
} from "lucide-react";
import { createContext, type ReactNode, useContext, useState } from "react";
import {
  DiscordButton,
  DiscordContainer,
  DiscordGallery,
  DiscordMessage,
  DiscordRow,
  DiscordSelect,
  DiscordStatus,
  DiscordText,
  Interpolate,
  Mention,
  Timestamp,
} from "~/components/mdx/discord";
import { EASE_OUT, MessageEnter } from "~/components/mdx/flow";
import { defaultLocale, type Locale } from "~/i18n";
import { type Phrase, type Translate, translator } from "~/i18n/translate";

type ChannelId = "welcome" | "lottery" | "shop";

const channels: Record<ChannelId, { name: Phrase; topic: Phrase }> = {
  welcome: { name: "新人報到", topic: "機器龍自動接待新成員" },
  lottery: { name: "抽獎區", topic: "辦抽獎，一條指令的事" },
  shop: { name: "yee-的小店", topic: "掛機的人都在這裡餵恐龍" },
};

const CHANNEL_IDS: ChannelId[] = ["welcome", "lottery", "shop"];

const BOT_NAME: Phrase = "YEE式機器龍";

const TranslateContext = createContext<Translate>(translator(defaultLocale));

function useT() {
  return useContext(TranslateContext);
}

export function DemoServer({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [active, setActive] = useState<ChannelId>("welcome");
  const [seen, setSeen] = useState<ChannelId[]>(["welcome"]);
  const channel = channels[active];

  function open(id: ChannelId) {
    setActive(id);
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <TranslateContext.Provider value={t}>
      <div className="z-[2] mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            {t("進來參觀一下")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("點左邊的頻道逛逛，按鈕都是真的能按。")}
          </p>
        </div>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="grid overflow-hidden rounded-xl border bg-discord-bg font-discord shadow-xl md:grid-cols-[15rem_1fr]"
        >
          <Sidebar active={active} seen={seen} onOpen={open} />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2 border-white/8 border-b px-4 py-3 text-discord-text">
              <HashIcon className="size-5 text-discord-muted" />
              <span className="font-semibold text-white">{t(channel.name)}</span>
              <span className="text-discord-muted text-sm max-sm:hidden">
                {t(channel.topic)}
              </span>
            </div>
            <ChannelTabs active={active} onOpen={open} />
            <div className="flex min-h-[21rem] flex-col gap-4 p-4 text-discord-text text-sm">
              <div key={active} className="flex flex-col gap-4">
                {active === "welcome" && <WelcomeScene />}
                {active === "lottery" && <LotteryScene />}
                {active === "shop" && <ShopScene />}
              </div>
              <div className="mt-auto flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5 pt-2.5 text-discord-placeholder">
                <PlusCircleIcon className="size-5 shrink-0" />
                {t("跟大家說點什麼…")}
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-muted-foreground">
          {t(
            "用指令打開歡迎訊息、身分組或抽獎的設定卡，再選項目、填資料，不用記一串參數",
          )}
        </p>
      </div>
    </TranslateContext.Provider>
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
  const t = useT();

  return {
    time: t("今天 21:30"),
    ephemeral: { note: t("只有你看得到這則訊息"), dismiss: t("關閉訊息") },
    command: (user: Phrase, name: string) => ({
      user: t(user),
      name,
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
        <DiscordMessage author={t(BOT_NAME)} time={chrome.time}>
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
        <DiscordMessage author={t(BOT_NAME)} time={chrome.time}>
          <DiscordText>
            <p>
              <Interpolate
                text={t("歡迎 {member} 加入伺服器！先在上面挑個身分組，讓大家認識你 🎉")}
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
            time={chrome.time}
            ephemeral={chrome.ephemeral}
          >
            <DiscordStatus
              emoji="check"
              title={
                <>
                  {t(reply.added ? "已取得" : "已移除")}{" "}
                  <Mention color={roleColors[reply.role]}>@{t(reply.role)}</Mention>
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

function LotteryScene() {
  const t = useT();
  const chrome = useChrome();
  const [joined, setJoined] = useState(false);
  const [reply, setReply] = useState<"joined" | "already" | "left">();
  const count = joined ? 43 : 42;
  const channel = <Mention>#{t("抽獎區")}</Mention>;
  const inSevenDays = <Timestamp>{t("7 天後")}</Timestamp>;

  function join() {
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
    <>
      <Msg delay={0}>
        <DiscordMessage
          author={t(BOT_NAME)}
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
                    date: <Timestamp>{t("2026年10月26日 星期一 21:30")}</Timestamp>,
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
              <DiscordButton variant="primary" emoji="party_popper" onClick={join}>
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
    </>
  );
}

function ShopScene() {
  const t = useT();
  const chrome = useChrome();
  const [cooking, setCooking] = useState(false);

  return (
    <Msg delay={0}>
      <DiscordMessage
        author={t(BOT_NAME)}
        time={chrome.time}
        command={chrome.command("阿龍的粉絲", "find-food")}
      >
        {cooking ? (
          <>
            <DiscordText>
              <p>{t("要下鍋的自己挑。Yee 在旁邊看。")}</p>
            </DiscordText>
            <DiscordSelect placeholder={t("挑食材")} />
            <DiscordRow>
              <DiscordButton onClick={() => setCooking(false)}>
                {t("回店裡")}
              </DiscordButton>
            </DiscordRow>
          </>
        ) : (
          <>
            <DiscordGallery
              src="/img/discord/feast-home.webp"
              alt={t("Yee 吃飽了嗎？銅板 1,234，Yee 今天想吃：鹹 · 脆")}
            />
            <DiscordRow>
              <DiscordButton disabled>
                {t("帶牠去找吃的")}
              </DiscordButton>
              <DiscordButton variant="primary" onClick={() => setCooking(true)}>
                {t("開煮")}
              </DiscordButton>
            </DiscordRow>
          </>
        )}
      </DiscordMessage>
    </Msg>
  );
}

function ChannelTabs({
  active,
  onOpen,
}: {
  active: ChannelId;
  onOpen: (id: ChannelId) => void;
}) {
  const t = useT();

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
          #{t(channels[id].name)}
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
  const t = useT();

  return (
    <div className="flex flex-col border-white/8 border-r bg-discord-embed p-3 text-discord-text max-md:hidden">
      <p className="border-white/8 border-b px-2 pb-3 font-semibold text-white">
        {t("Yeecord 示範伺服器")}
      </p>
      <p className="mt-2 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {t("文字頻道")}
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
            <span className="truncate">{t(channels[id].name)}</span>
            {!seen.includes(id) && (
              <span className="ms-auto size-2 rounded-full bg-discord-danger" />
            )}
          </button>
        ))}
      </div>
      <p className="mt-4 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {t("語音頻道")}
      </p>
      <div className="flex items-center gap-1.5 px-2 py-1 text-discord-muted">
        <Volume2Icon className="size-4 shrink-0" />
        {t("建立語音頻道")}
      </div>
      <div className="flex items-center gap-2 px-2 py-1 pl-7 text-discord-muted text-sm">
        <span className="size-2 rounded-full bg-discord-green" />
        {t("阿龍的頻道 · 3 人在聊")}
      </div>
      <div className="mt-auto flex items-center gap-2.5 rounded-lg bg-black/25 p-2">
        <img
          src="/img/logo.svg"
          alt=""
          className="size-8 rounded-full bg-discord-avatar p-0.5"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-medium text-sm text-white">{t(BOT_NAME)}</p>
          <p className="text-discord-muted text-xs">
            {t("陪 350,000 個伺服器玩耍中")}
          </p>
        </div>
      </div>
    </div>
  );
}
