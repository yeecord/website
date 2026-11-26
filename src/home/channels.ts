import type { Phrase } from "~/i18n/translate";

export type ChannelId = "welcome" | "lottery" | "voice";

export const channels: Record<ChannelId, { name: Phrase; topic: Phrase }> = {
  welcome: { name: "新人報到", topic: "機器龍自動接待新成員" },
  lottery: { name: "抽獎區", topic: "辦抽獎，一條指令的事" },
  voice: { name: "動態語音", topic: "進語音就開一間新的，人走光了自動收掉" },
};
