"use client";

import { AnimatePresence, motion } from "motion/react";
import { Lock, Volume2, X } from "lucide-react";
import {
  AppEmoji,
  DiscordButton,
  DiscordContainer,
  DiscordMessage,
  DiscordModal,
  DiscordRow,
  DiscordStatus,
  DiscordText,
  Interpolate,
  Mention,
  Spoiler,
  Timestamp,
} from "~/components/mdx/discord";
import {
  ClickHint,
  chatCopy,
  FlowFrame,
  HintedButton,
  MessageEnter,
  Scene,
  useLoop,
} from "~/components/mdx/flow";
import { PollCard } from "~/components/mdx/poll-card";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";
import { cn } from "~/utils/cn";

const T = {
  "zh-tw": {
    autoChannels: {
      steps: ["加入入口頻道", "生出專屬頻道", "沒人就回收"],
      caption: "入口只有一個，頻道用多少生多少，不用手動清",
      entry: "創建頻道",
      member: "阿貓",
      channel: "阿貓的頻道",
      recycling: "阿貓離開了，頻道即將自動刪除……",
    },
    lockChannel: {
      steps: ["上鎖", "沒密碼進不去", "輸入密碼加入"],
      caption: "密碼對了才拿得到進入權限，不用一個個設定成員權限",
      channel: "幹部頻道",
      leader: "團長",
      member: "阿貓",
      locked: "已鎖定 {channel}",
      lockedNote: "只有你和輸入密碼 {password} 的成員能加入",
      post: "貼出按鈕",
      undo: "移除鎖定",
      needs: "{channel} 需要密碼才能加入",
      hint: "按下「輸入密碼」，填好密碼就能加入",
      ask: "輸入密碼",
      denied: "阿貓想加入，但沒有進入權限",
      joined: "已可加入 {channel}",
      joinedNote: "直接點進頻道就能加入",
      goto: "前往頻道",
    },
    roleMenu: {
      steps: ["點按鈕領取", "再點一次取消"],
      caption: "成員自己領、自己退，管理員不用再手動發身分組",
      member: "阿貓",
      content: ["歡迎來到遊戲同好會！", "點下方選項獲得身分組"],
      hint: "再按一次可以移除",
      roles: ["活動通知", "遊戲玩家"],
      added: "已取得 {role}",
      addedNote: "再按一次「{name}」可以移除",
      removed: "已移除 {role}",
      removedNote: "再按一次「{name}」可以取回",
      undo: "復原",
    },
    giveaway: {
      steps: ["點按鈕參加", "確認參加成功", "時間到自動開獎"],
      caption: "參加只要一顆按鈕，開獎時間到機器龍自己來",
      creator: "團長",
      title: "Nitro 抽獎",
      channel: "抽獎區",
      rules: "抽出 3 位得獎者 · 抽獎會在 {date} ({time}) 結束",
      date: "2026年10月26日 星期一 21:30",
      shortDate: "2026年10月26日 21:30",
      relative: "7 天後",
      entries: "目前 {count} 人參加",
      join: "點我參加",
      end: "終止抽獎",
      joined: "已參加「{title}」",
      joinedNote: "目前 {count} 人參加，{time}抽出 3 位得獎者，結果會公布在 {channel}",
      leave: "退出抽獎",
      winners: ["@阿貓", "@小龍", "@路過的"],
      separator: "、",
      won: "{winners} 抽中了",
      ended: "{count} 人參加，{time} 結束",
      announcement: "恭喜 {winners} 抽中「{title}」",
      announcementNote: "從 {count} 位參加者中抽出，由 {creator} 發起",
      view: "查看抽獎",
    },
    poll: {
      steps: ["填表單發起", "成員投票", "票數即時更新"],
      caption: "每一票都會更新選項旁的長條，不用等結束才知道戰況",
      creator: "阿明",
      modal: {
        title: "建立投票",
        fields: [
          { label: "投票標題", value: "晚餐吃什麼？" },
          {
            label: "選項",
            description: "一行一個選項（2-18 個）",
            value: "火鍋\n燒肉\n拉麵",
          },
          {
            label: "多久後結束（選填）",
            description: "例如 30m、2h、3d，留空 = 手動結束",
            value: "2h",
          },
        ],
        cancel: "取消",
        submit: "送出",
      },
      question: "晚餐吃什麼？",
      startedAgo: "1 分鐘前",
      endsIn: "2 小時後",
      options: ["火鍋", "燒肉", "拉麵"],
      voted: "已投給「{option}」",
    },
  },
  "zh-cn": {
    autoChannels: {
      steps: ["加入入口频道", "生出专属频道", "没人就回收"],
      caption: "入口只有一个，频道用多少生多少，不用手动清",
      entry: "创建频道",
      member: "阿猫",
      channel: "阿猫的频道",
      recycling: "阿猫离开了，频道即将自动删除……",
    },
    lockChannel: {
      steps: ["上锁", "没密码进不去", "输入密码加入"],
      caption: "密码对了才拿得到进入权限，不用一个个设置成员权限",
      channel: "干部频道",
      leader: "团长",
      member: "阿猫",
      locked: "已锁定 {channel}",
      lockedNote: "只有你和输入密码 {password} 的成员能加入",
      post: "发出按钮",
      undo: "移除锁定",
      needs: "{channel} 需要密码才能加入",
      hint: "按下“输入密码”，填好密码就能加入",
      ask: "输入密码",
      denied: "阿猫想加入，但没有进入权限",
      joined: "已可加入 {channel}",
      joinedNote: "直接点进频道就能加入",
      goto: "前往频道",
    },
    roleMenu: {
      steps: ["点按钮领取", "再点一次取消"],
      caption: "成员自己领、自己退，管理员不用再手动发身份组",
      member: "阿猫",
      content: ["欢迎来到游戏同好会！", "点下方选项获得身份组"],
      hint: "再按一次可以移除",
      roles: ["活动通知", "游戏玩家"],
      added: "已获得 {role}",
      addedNote: "再按一次「{name}」可以移除",
      removed: "已移除 {role}",
      removedNote: "再按一次「{name}」可以取回",
      undo: "撤销",
    },
    giveaway: {
      steps: ["点按钮参加", "确认参加成功", "时间到自动开奖"],
      caption: "参加只要一颗按钮，开奖时间到机器龙自己来",
      creator: "团长",
      title: "Nitro 抽奖",
      channel: "抽奖区",
      rules: "抽出 3 位得奖者 · 抽奖会在 {date} ({time}) 结束",
      date: "2026年10月26日 星期一 21:30",
      shortDate: "2026年10月26日 21:30",
      relative: "7 天后",
      entries: "目前 {count} 人参加",
      join: "点我参加",
      end: "终止抽奖",
      joined: "已参加“{title}”",
      joinedNote: "目前 {count} 人参加，{time}抽出 3 位得奖者，结果会公布在 {channel}",
      leave: "退出抽奖",
      winners: ["@阿猫", "@小龙", "@路过的"],
      separator: "、",
      won: "{winners} 抽中了",
      ended: "{count} 人参加，{time} 结束",
      announcement: "恭喜 {winners} 抽中“{title}”",
      announcementNote: "从 {count} 位参加者中抽出，由 {creator} 发起",
      view: "查看抽奖",
    },
    poll: {
      steps: ["填表单发起", "成员投票", "票数实时更新"],
      caption: "每一票都会更新选项旁的票数条，不用等结束才知道战况",
      creator: "阿明",
      modal: {
        title: "创建投票",
        fields: [
          { label: "投票标题", value: "晚餐吃什么？" },
          {
            label: "选项",
            description: "一行一个选项（2-18 个）",
            value: "火锅\n烧肉\n拉面",
          },
          {
            label: "多久后结束（选填）",
            description: "例如 30m、2h、3d，留空 = 手动结束",
            value: "2h",
          },
        ],
        cancel: "取消",
        submit: "提交",
      },
      question: "晚餐吃什么？",
      startedAgo: "1 分钟前",
      endsIn: "2 小时后",
      options: ["火锅", "烧肉", "拉面"],
      voted: "已投给「{option}」",
    },
  },
} satisfies Partial<Record<Locale, unknown>>;

function VoiceChannel({
  name,
  locked,
  members = [],
  dimmed,
}: {
  name: string;
  locked?: boolean;
  members?: string[];
  dimmed?: boolean;
}) {
  return (
    <motion.div layout className={cn(dimmed && "opacity-50")}>
      <p className="flex items-center gap-1.5">
        {locked ? (
          <Lock className="size-4 text-discord-muted" />
        ) : (
          <Volume2 className="size-4 text-discord-muted" />
        )}
        {name}
      </p>
      <AnimatePresence initial={false}>
        {members.map((member) => (
          <motion.p
            key={member}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="ml-5 mt-0.5 flex items-center gap-1.5 text-discord-muted"
          >
            <span className="flex size-4 items-center justify-center rounded-full bg-discord-avatar text-[9px] font-semibold text-discord-bg">
              {member.slice(0, 1)}
            </span>
            {member}
          </motion.p>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function AutoChannelsDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).autoChannels;
  const [step, setStep, pressing] = useLoop(t.steps.length);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
    >
      <div className="space-y-2">
        <VoiceChannel
          name={t.entry}
          members={step === 0 ? [t.member] : []}
        />
        <AnimatePresence>
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <VoiceChannel
                name={t.channel}
                members={step === 1 ? [t.member] : []}
                dimmed={step === 2}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {step === 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-discord-muted"
          >
            {t.recycling}
          </motion.p>
        )}
      </div>
    </FlowFrame>
  );
}

export function LockChannelDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).lockChannel;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3600);
  const channel = (
    <Mention>
      <Volume2 className="inline size-4 align-[-3px]" /> {t.channel}
    </Mention>
  );

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass="min-h-64"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <DiscordMessage
              time={chat.time}
              command={chat.command(t.leader, "lock-channel setup")}
              ephemeral={chat.ephemeral}
            >
              <DiscordStatus
                emoji="check"
                title={<Interpolate text={t.locked} values={{ channel }} />}
                notes={[
                  <Interpolate
                    key="note"
                    text={t.lockedNote}
                    values={{ password: <Spoiler>1234</Spoiler> }}
                  />,
                ]}
              />
              <DiscordRow>
                <HintedButton variant="primary">{t.post}</HintedButton>
                <DiscordButton>{t.undo}</DiscordButton>
              </DiscordRow>
            </DiscordMessage>
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <DiscordMessage time={chat.time}>
              <DiscordText>
                <p>
                  <Interpolate text={t.needs} values={{ channel }} />
                </p>
                <small>{t.hint}</small>
              </DiscordText>
              <DiscordRow>
                <HintedButton variant="primary">{t.ask}</HintedButton>
              </DiscordRow>
            </DiscordMessage>
            <div className="mt-4 space-y-2">
              <VoiceChannel name={t.channel} locked members={[t.leader]} />
              <p className="flex items-center gap-1.5 text-[#ffa09b]">
                <X className="size-4" />
                {t.denied}
              </p>
            </div>
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
              <DiscordStatus
                emoji="check"
                title={<Interpolate text={t.joined} values={{ channel }} />}
                notes={[t.joinedNote]}
              />
              <DiscordRow>
                <DiscordButton variant="link">{t.goto}</DiscordButton>
              </DiscordRow>
            </DiscordMessage>
            <div className="mt-4">
              <VoiceChannel
                name={t.channel}
                locked
                members={[t.leader, t.member]}
              />
            </div>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

const ROLE_COLOR = "#f0b232";

export function RoleMenuDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).roleMenu;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3200);
  const [role] = t.roles;
  const added = step === 0;

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass="min-h-72"
    >
      <DiscordMessage time={chat.time}>
        <DiscordContainer accent>
          <DiscordText>
            {t.content.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </DiscordText>
          <DiscordText>
            <small>{t.hint}</small>
          </DiscordText>
          <DiscordRow>
            <HintedButton>{role}</HintedButton>
            {t.roles.slice(1).map((other) => (
              <DiscordButton key={other}>{other}</DiscordButton>
            ))}
          </DiscordRow>
        </DiscordContainer>
      </DiscordMessage>
      <MessageEnter key={step} className="mt-4">
        <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
          <DiscordStatus
            emoji="check"
            title={
              <Interpolate
                text={added ? t.added : t.removed}
                values={{ role: <Mention color={ROLE_COLOR}>@{role}</Mention> }}
              />
            }
            notes={[
              <Interpolate
                key="note"
                text={added ? t.addedNote : t.removedNote}
                values={{ name: role }}
              />,
            ]}
          />
          <DiscordRow>
            <DiscordButton>{t.undo}</DiscordButton>
          </DiscordRow>
        </DiscordMessage>
      </MessageEnter>
    </FlowFrame>
  );
}

export function GiveawayFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).giveaway;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3600);
  const count = step === 0 ? 48 : 49;
  const relative = <Timestamp>{t.relative}</Timestamp>;
  const channel = <Mention>#{t.channel}</Mention>;
  const winners = t.winners.flatMap((winner, index) => [
    index > 0 ? t.separator : null,
    <Mention key={winner}>{winner}</Mention>,
  ]);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass="min-h-96"
    >
      <DiscordMessage
        time={chat.time}
        command={chat.command(t.creator, "giveaway create")}
      >
        <DiscordContainer accent>
          <DiscordText>
            <h2>{t.title}</h2>
          </DiscordText>
          {step === 2 ? (
            <>
              <DiscordText>
                <p>
                  <AppEmoji name="party_popper" />{" "}
                  <Interpolate text={t.won} values={{ winners }} />
                </p>
              </DiscordText>
              <DiscordText>
                <small>
                  <Interpolate
                    text={t.ended}
                    values={{
                      count,
                      time: <Timestamp>{t.shortDate}</Timestamp>,
                    }}
                  />
                </small>
              </DiscordText>
            </>
          ) : (
            <>
              <DiscordText>
                <small>
                  <Interpolate
                    text={t.rules}
                    values={{
                      date: <Timestamp>{t.date}</Timestamp>,
                      time: relative,
                    }}
                  />
                </small>
              </DiscordText>
              <DiscordText>
                <small>
                  <Interpolate text={t.entries} values={{ count }} />
                </small>
              </DiscordText>
              <DiscordRow>
                {step === 0 ? (
                  <HintedButton variant="primary" emoji="party_popper">
                    {t.join}
                  </HintedButton>
                ) : (
                  <DiscordButton variant="primary" emoji="party_popper">
                    {t.join}
                  </DiscordButton>
                )}
                <DiscordButton variant="danger">{t.end}</DiscordButton>
              </DiscordRow>
            </>
          )}
        </DiscordContainer>
      </DiscordMessage>
      {step === 1 ? (
        <MessageEnter key="joined" className="mt-4">
          <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
            <DiscordStatus
              emoji="check"
              title={<Interpolate text={t.joined} values={{ title: t.title }} />}
              notes={[
                <Interpolate
                  key="note"
                  text={t.joinedNote}
                  values={{ count, time: relative, channel }}
                />,
              ]}
            />
            <DiscordRow>
              <DiscordButton>{t.leave}</DiscordButton>
            </DiscordRow>
          </DiscordMessage>
        </MessageEnter>
      ) : null}
      {step === 2 ? (
        <MessageEnter key="announced" className="mt-4">
          <DiscordMessage time={chat.time}>
            <DiscordText>
              <p>
                <AppEmoji name="party_popper" />{" "}
                <Interpolate
                  text={t.announcement}
                  values={{ winners, title: t.title }}
                />
              </p>
              <small>
                <Interpolate
                  text={t.announcementNote}
                  values={{ count, creator: <Mention>@{t.creator}</Mention> }}
                />
              </small>
            </DiscordText>
            <DiscordRow>
              <DiscordButton variant="link">{t.view}</DiscordButton>
            </DiscordRow>
          </DiscordMessage>
        </MessageEnter>
      ) : null}
    </FlowFrame>
  );
}

const pollVotes = [
  [2, 2, 1],
  [3, 2, 1],
];

export function PollFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).poll;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3600);
  const votes = pollVotes[step === 2 ? 1 : 0];

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass="min-h-[34rem]"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <DiscordModal
              {...t.modal}
              className="mx-auto"
              submitPressed={pressing}
              submitHint={<ClickHint className="-right-1 -bottom-1" />}
            />
          </Scene>
        )}
        {step !== 0 && (
          <Scene id={1}>
            <DiscordMessage
              time={chat.time}
              command={chat.command(t.creator, "poll create")}
            >
              <PollCard
                locale={locale}
                title={t.question}
                creator={t.creator}
                startedAgo={t.startedAgo}
                endsIn={t.endsIn}
                options={t.options.map((name, index) => ({
                  name,
                  votes: votes[index] ?? 0,
                }))}
                pressed={step === 1 && pressing ? 0 : undefined}
                hint={
                  step === 1 ? <ClickHint className="-right-1 -bottom-1" /> : null
                }
              />
            </DiscordMessage>
            {step === 2 ? (
              <MessageEnter className="mt-4">
                <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
                  <DiscordStatus
                    emoji="check"
                    title={t.voted.replace("{option}", t.options[0] ?? "")}
                  />
                </DiscordMessage>
              </MessageEnter>
            ) : null}
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}
