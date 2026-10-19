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
  AppEmoji,
  DiscordButton,
  DiscordContainer,
  DiscordMessage,
  DiscordRow,
  DiscordSection,
  DiscordSelect,
  DiscordSeparator,
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

type ChannelId = "welcome" | "lottery" | "shop";

const channels: Record<ChannelId, { name: Phrase; topic: Phrase }> = {
  welcome: { name: "新人報到", topic: "機器龍自動接待新成員" },
  lottery: { name: "抽獎區", topic: "辦抽獎，一條指令的事" },
  shop: { name: "夜市攤位", topic: "夜市攤位版即將推出，先來試玩" },
};

const CHANNEL_IDS: ChannelId[] = ["welcome", "lottery", "shop"];

const BOT_NAME: Phrase = "YEE式機器龍";

const LocaleContext = createContext<{ locale: Locale; t: Translate }>({
  locale: defaultLocale,
  t: translator(defaultLocale),
});

function useT() {
  return useContext(LocaleContext).t;
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
    <LocaleContext.Provider value={{ locale, t }}>
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
              <span className="font-semibold text-white">
                {t(channel.name)}
              </span>
              <span className="text-discord-muted text-sm max-sm:hidden">
                {t(channel.topic)}
              </span>
            </div>
            <ChannelTabs active={active} onOpen={open} />
            <div className="flex min-h-[21rem] flex-col gap-4 p-4 text-discord-text text-sm">
              <div key={active} className="flex flex-col gap-4">
                {active === "welcome" && <WelcomeScene />}
                {active === "lottery" && <LotteryScene />}
                {active === "shop" && <StallScene />}
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
    </>
  );
}

// The night-market stall is the upcoming game; the docs still describe /find-food until it ships.
const STALL: Phrase = "阿凱的滷味攤";

const PLACES = [
  {
    value: "market",
    label: "市場",
    description: "常見食材比較多",
    went: "Yee 去市場了",
  },
  {
    value: "sea",
    label: "海邊",
    description: "可能撿到不常見的海產",
    went: "Yee 去海邊了",
  },
  {
    value: "mountain",
    label: "山上",
    description: "煮出一道用海邊食材的菜就會開放",
    went: "Yee 上山了",
  },
] as const satisfies {
  value: string;
  label: Phrase;
  description: Phrase;
  went: Phrase;
}[];

const TRIPS = [
  { value: "2", label: "2 小時", count: 1, back: "今晚 11:04" },
  { value: "6", label: "6 小時", count: 3, back: "明早 3:04" },
  { value: "12", label: "12 小時", count: 6, back: "明早 9:04" },
  { value: "24", label: "24 小時", count: 13, back: "明晚 9:04" },
] as const satisfies {
  value: string;
  label: Phrase;
  count: number;
  back: Phrase;
}[];

const INGREDIENTS = [
  { value: "sweet-chili", label: "甜辣醬", description: "甜・辣" },
  { value: "chili", label: "辣椒醬", description: "辣・鹹" },
  { value: "peanut", label: "花生粉", description: "甜・香" },
  { value: "soy-paste", label: "醬油膏", description: "鹹・甜" },
  { value: "rice-blood", label: "豬血糕", description: "Q・鹹" },
] as const satisfies { value: string; label: Phrase; description: Phrase }[];

/** Guesses the board calls close to an ingredient of the answer without being one. */
const NEAR_MISSES: string[] = ["chili", "soy-paste"];

type StallScreen = "home" | "tried" | "trip" | "gone" | "board";

function StallScene() {
  const t = useT();
  const chrome = useChrome();
  const [screen, setScreen] = useState<StallScreen>("home");
  const [place, setPlace] = useState("market");
  const [trip, setTrip] = useState("12");
  const [guess, setGuess] = useState<string>();
  const home = (
    <DiscordButton onClick={() => setScreen("home")}>
      {t("回攤位")}
    </DiscordButton>
  );
  const chosenTrip = TRIPS.find((option) => option.value === trip) ?? TRIPS[2];
  const chosenPlace =
    PLACES.find((option) => option.value === place) ?? PLACES[0];

  return (
    <Msg delay={0}>
      <DiscordMessage
        author={t(BOT_NAME)}
        bot
        time={chrome.time}
        command={chrome.command("阿凱", "stall")}
        ephemeral={chrome.ephemeral}
      >
        {screen === "home" ? (
          <DiscordContainer>
            <DiscordText>
              <h2>{t(STALL)}</h2>
              <p>{t("開張第 3 天，累計賣出 7 份")}</p>
              <small>{t("你不在時賣了 2 份，收入 118，買的人是上班族")}</small>
            </DiscordText>
            <DiscordText>
              <p>{t("Yee 從海邊回來了，帶回豆腐和台式泡菜")}</p>
            </DiscordText>
            <DiscordRow>
              <DiscordButton
                variant="primary"
                onClick={() => setScreen("tried")}
              >
                {t("試做新菜（買胡椒鹽 32，一定成功）")}
              </DiscordButton>
              <DiscordButton onClick={() => setScreen("trip")}>
                {t("派 Yee 出門")}
              </DiscordButton>
              <DiscordButton>{t("做菜")}</DiscordButton>
            </DiscordRow>
            <DiscordSeparator divider={false} />
            <DiscordSection
              accessory={
                <DiscordButton onClick={() => setScreen("board")}>
                  {t("去猜")}
                </DiscordButton>
              }
            >
              <DiscordText>
                <h3>{t("研究板")}</h3>
                <p>{t("全伺服器在猜一道「甜・辣・Q」的菜，已確定 2／3 樣")}</p>
                <small>
                  {t("🟩 答案裡有　🟨 答案裡沒有，但很像其中一樣　⬛ 不像")}
                </small>
              </DiscordText>
            </DiscordSection>
            <DiscordSeparator divider={false} />
            <DiscordRow>
              <DiscordButton>{t("背包")}</DiscordButton>
              <DiscordButton>{t("食譜")}</DiscordButton>
              <DiscordButton>{t("今日市場")}</DiscordButton>
              <DiscordButton>{t("逛夜市")}</DiscordButton>
            </DiscordRow>
            <DiscordText>
              <small>{t("體力 240／240，另外存了 210　金幣 902")}</small>
            </DiscordText>
          </DiscordContainer>
        ) : null}
        {screen === "tried" ? (
          <DiscordContainer>
            <DiscordText>
              <h3>
                <AppEmoji name="party_popper" /> {t("學會新菜「胡椒鹽豆腐」")}
              </h3>
              <p>{t("煮了 4 份，每份 58，已經上架")}</p>
              <small>{t("買了胡椒鹽，花 32 金幣、20 體力")}</small>
            </DiscordText>
            <DiscordRow>
              <DiscordButton
                variant="primary"
                onClick={() => setScreen("home")}
              >
                {t("回攤位")}
              </DiscordButton>
            </DiscordRow>
          </DiscordContainer>
        ) : null}
        {screen === "trip" ? (
          <DiscordContainer>
            <DiscordText>
              <h2>{t("派 Yee 出門")}</h2>
              <small>{t("東西會一直等你，晚點回來也不會壞")}</small>
            </DiscordText>
            <DiscordSelect
              placeholder={t("去哪裡")}
              value={[place]}
              onChange={([value]) => setPlace(value ?? place)}
              options={PLACES.map((option) => ({
                value: option.value,
                label: t(option.label),
                description: t(option.description),
              }))}
            />
            <DiscordSelect
              placeholder={t("去多久")}
              value={[trip]}
              onChange={([value]) => setTrip(value ?? trip)}
              options={TRIPS.map((option) => ({
                value: option.value,
                label: t(option.label),
                description: (
                  <Interpolate
                    text={t("約 {count} 樣，{back} 回來")}
                    values={{
                      count: option.count,
                      back: t(option.back),
                    }}
                  />
                ),
              }))}
            />
            <DiscordRow>
              <DiscordButton
                variant="primary"
                onClick={() => setScreen("gone")}
              >
                {t("出門")}
              </DiscordButton>
              {home}
            </DiscordRow>
          </DiscordContainer>
        ) : null}
        {screen === "gone" ? (
          <>
            <DiscordStatus
              emoji="check"
              title={t(chosenPlace.went)}
              notes={[
                <Interpolate
                  text={t("{back} 回來，大約帶回 {count} 樣")}
                  values={{
                    back: t(chosenTrip.back),
                    count: chosenTrip.count,
                  }}
                />,
              ]}
            />
            <DiscordRow>{home}</DiscordRow>
          </>
        ) : null}
        {screen === "board" ? (
          <DiscordContainer>
            <DiscordText>
              <h2>{t("研究板")}</h2>
              <p>{t("這道菜嚐起來「甜・辣・Q」，一共 3 樣食材")}</p>
              <p>{t("已確定魚漿和白蘿蔔")}</p>
            </DiscordText>
            <DiscordText>
              <h3>{t("昨天的嘗試")}</h3>
              <p>{t("🟩🟩🟨 魚漿、白蘿蔔、辣椒醬")}</p>
              <small>{t("小美")}</small>
              <p>{t("🟩⬛⬛ 魚漿、豬血糕、花生粉")}</p>
              <small>{t("阿明")}</small>
            </DiscordText>
            {guess ? (
              <>
                <DiscordSeparator divider={false} />
                <BoardResult guess={guess} />
              </>
            ) : null}
            {guess === "sweet-chili" ? null : (
              <DiscordSelect
                placeholder={t("選第三樣，免費試味道（今天還能猜 3 次）")}
                value={guess ? [guess] : []}
                onChange={([value]) => setGuess(value)}
                options={INGREDIENTS.map((option) => ({
                  value: option.value,
                  label: t(option.label),
                  description: t(option.description),
                }))}
              />
            )}
            <DiscordRow>{home}</DiscordRow>
          </DiscordContainer>
        ) : null}
      </DiscordMessage>
    </Msg>
  );
}

function BoardResult({ guess }: { guess: string }) {
  const t = useT();
  const ingredient = INGREDIENTS.find((option) => option.value === guess);

  if (guess === "sweet-chili") {
    return (
      <DiscordText>
        <p>
          <AppEmoji name="party_popper" /> {t("🟩🟩🟩 猜中了，是「甜不辣」")}
        </p>
        <p>{t("你和小美、阿明都學會了這道菜")}</p>
      </DiscordText>
    );
  }

  return (
    <DiscordText>
      <p>
        {ingredient && NEAR_MISSES.includes(guess) ? (
          <Interpolate
            text={t("🟩🟩🟨 {name}很像其中一樣，但不是它")}
            values={{
              name: t(ingredient.label),
            }}
          />
        ) : (
          t("🟩🟩⬛ 不像答案裡的任何一樣")
        )}
      </p>
      <small>{t("今天還能猜 2 次")}</small>
    </DiscordText>
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
          <p className="truncate font-medium text-sm text-white">
            {t(BOT_NAME)}
          </p>
          <p className="text-discord-muted text-xs">
            {t("陪 350,000 個伺服器玩耍中")}
          </p>
        </div>
      </div>
    </div>
  );
}
