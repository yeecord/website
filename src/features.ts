import type { Phrase } from "~/i18n/translate";

// https://discord.com/developers/docs/topics/permissions
export const PERMISSIONS = {
  viewChannel: { label: "檢視頻道", bit: 1n << 10n },
  sendMessages: { label: "傳送訊息", bit: 1n << 11n },
  readHistory: { label: "閱讀歷史訊息", bit: 1n << 16n },
  attachFiles: { label: "附加檔案", bit: 1n << 15n },
  manageChannels: { label: "管理頻道", bit: 1n << 4n },
  connect: { label: "連接", bit: 1n << 20n },
  moveMembers: { label: "移動成員", bit: 1n << 24n },
  manageRoles: { label: "管理身分組", bit: 1n << 28n },
  manageMessages: { label: "管理訊息", bit: 1n << 13n },
  privateThreads: { label: "建立私人討論串", bit: 1n << 36n },
  sendInThreads: { label: "在討論串中傳送訊息", bit: 1n << 38n },
  manageThreads: { label: "管理討論串", bit: 1n << 34n },
  banMembers: { label: "封鎖成員", bit: 1n << 2n },
  timeoutMembers: { label: "禁言成員", bit: 1n << 40n },
} satisfies Record<string, { label: Phrase; bit: bigint }>;

export type Permission = keyof typeof PERMISSIONS;

/** 機器龍進伺服器一定要有的權限：看得到頻道、能回覆、能上傳畫好的圖卡 */
export const REQUIRED_PERMISSIONS: Permission[] = [
  "viewChannel",
  "sendMessages",
  "readHistory",
  "attachFiles",
];

/** 跟機器人 /help 的分類同一套 */
export const CATEGORIES = {
  welcome: "迎新與身分組",
  voice: "語音頻道",
  moderation: "管理與防護",
  events: "活動",
} satisfies Record<string, Phrase>;

export type Category = keyof typeof CATEGORIES;

export type Feature = {
  id: string;
  category: Category;
  title: Phrase;
  pitch: Phrase;
  /** 文件在 /docs/commands 底下的頁面名稱 */
  docs: string;
  /** 必要權限以外還要多給的權限，跟機器人各功能檢查的一致 */
  permissions: Permission[];
};

export const FEATURES: Feature[] = [
  {
    id: "giveaway",
    category: "events",
    title: "抽獎",
    pitch: "辦一場抽獎，時間到自動開獎。",
    docs: "giveaway",
    permissions: [],
  },
  {
    id: "poll",
    category: "events",
    title: "投票",
    pitch: "匿名、鎖票、開票前保密，結束時畫成結果圖。",
    docs: "poll",
    permissions: [],
  },
  {
    id: "notification",
    category: "welcome",
    title: "成員通知",
    pitch: "有人加入或離開，在指定頻道發一則訊息。",
    docs: "member-notification",
    permissions: [],
  },
  {
    id: "voice",
    category: "voice",
    title: "動態語音頻道",
    pitch: "有人進語音就開一間專屬房間，人走了自動收。",
    docs: "auto-channels",
    permissions: ["manageChannels", "connect", "moveMembers"],
  },
  {
    id: "auto-role",
    category: "welcome",
    title: "新成員身分組",
    pitch: "新成員一進來，自動發指定的身分組。",
    docs: "auto-role",
    permissions: ["manageRoles"],
  },
  {
    id: "role-menu",
    category: "welcome",
    title: "身分組選單",
    pitch: "發一則訊息，成員自己按按鈕領身分組。",
    docs: "role-menu",
    permissions: ["manageRoles"],
  },
  {
    id: "lock",
    category: "voice",
    title: "鎖定語音頻道",
    pitch: "幫語音頻道上密碼，輸入正確才進得去。",
    docs: "lock-channel",
    permissions: ["manageChannels", "manageRoles"],
  },
  {
    id: "clear",
    category: "moderation",
    title: "大量刪除訊息",
    pitch: "洗版訊息一次清掉，最多一千則。",
    docs: "clear",
    permissions: ["manageMessages"],
  },
  {
    id: "form",
    category: "moderation",
    title: "表單",
    pitch: "收檢舉、申請或客服單，每一份開一個私人討論串。",
    docs: "form",
    permissions: ["privateThreads", "sendInThreads", "manageThreads"],
  },
  {
    id: "defense",
    category: "moderation",
    title: "機器人防禦",
    pitch: "廣告機器人一發言就封鎖，詐騙圖片自動攔下。",
    docs: "bot-fight",
    permissions: ["banMembers", "timeoutMembers", "manageMessages"],
  },
];
