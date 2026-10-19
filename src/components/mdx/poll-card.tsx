import type { ReactNode } from "react";
import {
  DiscordButton,
  DiscordContainer,
  DiscordRow,
  DiscordSection,
  DiscordText,
  Interpolate,
  Mention,
  Timestamp,
} from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";

const T = {
  "zh-tw": {
    started: "{votes}，由 {creator} 發起於 {time}",
    endsAt: "投票會在 {time} 結束",
    votes: "{count} 票",
    vote: "投票",
    reset: "重置我的投票",
    end: "終止投票",
  },
  "zh-cn": {
    started: "{votes}，由 {creator} 发起于 {time}",
    endsAt: "投票会在 {time} 结束",
    votes: "{count} 票",
    vote: "投票",
    reset: "重置我的投票",
    end: "终止投票",
  },
} satisfies Partial<Record<Locale, unknown>>;

const BAR_CELLS = 10;

export interface PollOption {
  name: string;
  votes: number;
}

/// The live poll card the bot posts: a header, each option with its tally and vote button, then the controls.
export function PollCard({
  locale,
  title,
  creator,
  startedAgo,
  endsIn,
  options,
  pressed,
  hint,
}: {
  locale: Locale;
  title: string;
  creator: string;
  startedAgo: string;
  endsIn: string;
  options: PollOption[];
  /** The option whose vote button shows as pressed. */
  pressed?: number;
  /** Drawn over the first option's vote button, such as the cursor of a demo. */
  hint?: ReactNode;
}) {
  const t = localized(T, locale);
  const total = options.reduce((sum, option) => sum + option.votes, 0);
  const votes = (count: number) => t.votes.replace("{count}", String(count));

  return (
    <DiscordContainer accent>
      <DiscordText>
        <h2>{title}</h2>
        <small>
          <Interpolate
            text={t.started}
            values={{
              votes: votes(total),
              creator: <Mention>@{creator}</Mention>,
              time: <Timestamp>{startedAgo}</Timestamp>,
            }}
          />
        </small>
        <small>
          <Interpolate
            text={t.endsAt}
            values={{ time: <Timestamp>{endsIn}</Timestamp> }}
          />
        </small>
      </DiscordText>
      {options.map((option, index) => (
        <DiscordSection
          key={option.name}
          accessory={
            <span className="relative inline-flex">
              <DiscordButton pressed={pressed === index}>{t.vote}</DiscordButton>
              {index === 0 ? hint : null}
            </span>
          }
        >
          <DiscordText>
            <p>
              <strong>{option.name}</strong>
            </p>
            <p>
              <code>{meter(option.votes, total)}</code> {votes(option.votes)} ·{" "}
              {percent(option.votes, total)}
            </p>
          </DiscordText>
        </DiscordSection>
      ))}
      <DiscordRow>
        <DiscordButton>{t.reset}</DiscordButton>
        <DiscordButton variant="danger">{t.end}</DiscordButton>
      </DiscordRow>
    </DiscordContainer>
  );
}

function meter(votes: number, total: number) {
  const filled = total > 0 ? Math.round((votes / total) * BAR_CELLS) : 0;

  return "█".repeat(filled) + "░".repeat(BAR_CELLS - filled);
}

function percent(votes: number, total: number) {
  const fraction = total > 0 ? votes / total : 0;

  return `${Math.round(fraction * 1000) / 10}%`;
}
