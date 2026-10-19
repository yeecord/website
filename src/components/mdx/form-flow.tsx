"use client";

import { AnimatePresence } from "motion/react";
import { Hash, Lock } from "lucide-react";
import {
  DiscordButton,
  DiscordContainer,
  DiscordMessage,
  DiscordModal,
  DiscordRow,
  DiscordSeparator,
  DiscordStatus,
  DiscordText,
  Interpolate,
  Mention,
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
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";

const T = {
  "zh-tw": {
    flow: {
      steps: ["按下按鈕", "填寫表單", "私人討論串"],
      channel: "檢舉區",
      panelTitle: "📋 檢舉玩家",
      panelNote: "濫用、外掛檢舉專用",
      cta: "我要檢舉",
      modalTitle: "檢舉玩家",
      answers: [
        { question: "被檢舉人是誰？", answer: "BadGuy#1234" },
        { question: "發生什麼事？", answer: "在語音頻道開外掛還嗆人……" },
      ],
      cancel: "取消",
      submit: "送出",
      thread: "#0042 阿貓",
      threadTag: "私人討論串",
      member: "@阿貓",
      staff: "@管理組",
      ticketTitle: "📋 檢舉玩家 #0042",
      claim: "接手",
      close: "結案",
      submitted: "已送出",
      submittedNote: "後續回覆會出現在 {channel}",
      caption: "成員只要按按鈕、填完送出，剩下的機器龍包辦",
    },
    builder: {
      steps: ["建立表單", "加題目", "發佈面板"],
      title: "檢舉玩家",
      unpublished: "還沒發佈",
      published: "已發佈到 {channel}",
      channel: "檢舉區",
      notified: "新申請會通知 {roles}",
      staff: "@管理組",
      empty: "還沒有題目",
      emptyNote: "沒有題目時，按鈕會直接開私人討論串",
      questions: [
        "1. 被檢舉人是誰？（短答，必填）",
        "2. 發生什麼事？（段落，必填）",
      ],
      room: "還能加 3 題",
      publish: "發佈",
      add: "新增題目",
      adjust: "調整題目",
      remove: "刪除題目",
      settings: "設定",
      disable: "停用",
      caption: "整個過程都在同一張管理卡上，卡片原地更新",
    },
  },
  "zh-cn": {
    flow: {
      steps: ["按下按钮", "填写表单", "私密子区"],
      channel: "举报区",
      panelTitle: "📋 举报玩家",
      panelNote: "滥用、外挂举报专用",
      cta: "我要举报",
      modalTitle: "举报玩家",
      answers: [
        { question: "被举报人是谁？", answer: "BadGuy#1234" },
        { question: "发生什么事？", answer: "在语音频道开外挂还骂人……" },
      ],
      cancel: "取消",
      submit: "提交",
      thread: "#0042 阿猫",
      threadTag: "私密子区",
      member: "@阿猫",
      staff: "@管理组",
      ticketTitle: "📋 举报玩家 #0042",
      claim: "接手",
      close: "结案",
      submitted: "已提交",
      submittedNote: "后续回复会出现在 {channel}",
      caption: "成员只要按按钮、填完提交，剩下的机器龙包办",
    },
    builder: {
      steps: ["创建表单", "加题目", "发布面板"],
      title: "举报玩家",
      unpublished: "还没发布",
      published: "已发布到 {channel}",
      channel: "举报区",
      notified: "新申请会通知 {roles}",
      staff: "@管理组",
      empty: "还没有题目",
      emptyNote: "没有题目时，按钮会直接打开私人讨论串",
      questions: [
        "1. 被举报人是谁？（短答，必填）",
        "2. 发生什么事？（段落，必填）",
      ],
      room: "还能加 3 题",
      publish: "发布",
      add: "新增题目",
      adjust: "调整题目",
      remove: "删除题目",
      settings: "设置",
      disable: "停用",
      caption: "整个过程都在同一张管理卡上，卡片原地更新",
    },
  },
} satisfies Partial<Record<Locale, unknown>>;

export function FormFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).flow;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3600);
  const thread = <Mention>{t.thread}</Mention>;

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass="min-h-[30rem]"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <p className="mb-3 flex items-center gap-1 text-discord-muted">
              <Hash className="size-4" />
              {t.channel}
            </p>
            <DiscordMessage time={chat.time}>
              <DiscordText>
                <h2>{t.panelTitle}</h2>
                <p>{t.panelNote}</p>
              </DiscordText>
              <DiscordRow>
                <HintedButton variant="primary">{t.cta}</HintedButton>
              </DiscordRow>
            </DiscordMessage>
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <DiscordModal
              title={t.modalTitle}
              fields={t.answers.map(({ question, answer }, index) => ({
                label: question,
                value: answer,
                multiline: index > 0,
              }))}
              cancel={t.cancel}
              submit={t.submit}
              className="mx-auto"
              submitPressed={pressing}
              submitHint={<ClickHint className="-right-1 -bottom-1" />}
            />
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <p className="mb-3 flex items-center gap-1 text-discord-muted">
              <Lock className="size-4" />
              {t.thread}
              <span className="ml-1 rounded bg-discord-input px-1.5 py-px text-[10px]">
                {t.threadTag}
              </span>
            </p>
            <DiscordMessage time={chat.time}>
              <DiscordText>
                <p>
                  <Mention>{t.member}</Mention> <Mention>{t.staff}</Mention>
                </p>
              </DiscordText>
              <DiscordText>
                <h2>{t.ticketTitle}</h2>
              </DiscordText>
              {t.answers.map(({ question, answer }) => (
                <div key={question} className="grid gap-2">
                  <DiscordText>
                    <p>
                      <strong>{question}</strong>
                    </p>
                  </DiscordText>
                  <DiscordText>
                    <blockquote>{answer}</blockquote>
                  </DiscordText>
                </div>
              ))}
              <DiscordSeparator />
              <DiscordRow>
                <DiscordButton variant="primary">{t.claim}</DiscordButton>
                <DiscordButton>{t.close}</DiscordButton>
              </DiscordRow>
            </DiscordMessage>
            <MessageEnter delay={0.2} className="mt-4">
              <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
                <DiscordStatus
                  emoji="check"
                  title={t.submitted}
                  notes={[
                    <Interpolate
                      key="note"
                      text={t.submittedNote}
                      values={{ channel: thread }}
                    />,
                  ]}
                />
              </DiscordMessage>
            </MessageEnter>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

export function FormBuilderDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).builder;
  const chat = chatCopy(locale);
  const [step, setStep, pressing] = useLoop(t.steps.length, 3600);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      pressing={pressing}
      caption={t.caption}
      minHeightClass=""
    >
      <DiscordMessage time={chat.time} ephemeral={chat.ephemeral}>
        <ManageCard step={step} copy={t} />
      </DiscordMessage>
    </FlowFrame>
  );
}

/// The form's manage card at each step of the builder: empty, with questions, then published.
function ManageCard({
  step,
  copy: t,
}: {
  step: number;
  copy: (typeof T)["zh-tw"]["builder"];
}) {
  const empty = step === 0;
  const published = step === 2;
  const hinted = (index: number) =>
    (step === 0 && index === 1) || (step === 1 && index === 0);
  const buttons = [
    { label: t.publish, primary: step === 1 },
    { label: t.add, primary: empty },
    { label: t.adjust, disabled: empty },
    { label: t.remove, disabled: empty },
    { label: t.settings },
  ];

  return (
    <DiscordContainer accent>
      <DiscordText>
        <h2>{t.title}</h2>
      </DiscordText>
      <DiscordText>
        <p>
          {published ? (
            <Interpolate
              text={t.published}
              values={{ channel: <Mention>#{t.channel}</Mention> }}
            />
          ) : (
            t.unpublished
          )}
        </p>
      </DiscordText>
      <DiscordText>
        <small>
          <Interpolate
            text={t.notified}
            values={{ roles: <Mention color="#3ba55c">{t.staff}</Mention> }}
          />
        </small>
      </DiscordText>
      <DiscordSeparator divider={false} />
      <DiscordText>
        {empty ? (
          <>
            <p>{t.empty}</p>
            <small>{t.emptyNote}</small>
          </>
        ) : (
          <>
            {t.questions.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <small>{t.room}</small>
          </>
        )}
      </DiscordText>
      <DiscordSeparator divider={false} />
      <DiscordRow>
        {buttons.map((button, index) => {
          const variant = button.primary ? "primary" : "secondary";

          return hinted(index) ? (
            <HintedButton key={button.label} variant={variant}>
              {button.label}
            </HintedButton>
          ) : (
            <DiscordButton
              key={button.label}
              variant={variant}
              disabled={button.disabled}
            >
              {button.label}
            </DiscordButton>
          );
        })}
      </DiscordRow>
      <DiscordRow>
        <DiscordButton>{t.disable}</DiscordButton>
      </DiscordRow>
    </DiscordContainer>
  );
}
