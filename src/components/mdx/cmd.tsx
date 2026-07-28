import type { Locale } from "~/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// 顯示名稱同步自 yeecord repo src/infrastructure/i18n/{zh-TW,zh-CN}.json 的 slash.*.name
export const commandNames: Record<string, Record<Locale, string>> = {
  "1a2b": { "zh-tw": "1a2b", "zh-cn": "1a2b" },
  "afk-channel": { "zh-tw": "閒置頻道", "zh-cn": "挂机频道" },
  "auto-channels": { "zh-tw": "動態語音頻道", "zh-cn": "動態語音頻道" },
  "auto-role": { "zh-tw": "新成員身分組", "zh-cn": "新成员身份组" },
  avatar: { "zh-tw": "頭貼", "zh-cn": "头像" },
  banner: { "zh-tw": "旗幟", "zh-cn": "旗帜" },
  "bot-fight": { "zh-tw": "機器人防禦", "zh-cn": "机器人防御" },
  bullshit: { "zh-tw": "唬爛產生器", "zh-cn": "胡说八道生成器" },
  clear: { "zh-tw": "大量刪除訊息", "zh-cn": "大量删除消息" },
  feedback: { "zh-tw": "回報", "zh-cn": "反馈" },
  form: { "zh-tw": "表單", "zh-cn": "表单" },
  "find-food": { "zh-tw": "找吃的", "zh-cn": "找吃的" },
  giveaway: { "zh-tw": "抽獎", "zh-cn": "抽奖" },
  guild: { "zh-tw": "伺服器資訊", "zh-cn": "服务器信息" },
  help: { "zh-tw": "幫助", "zh-cn": "帮助" },
  "lock-channel": { "zh-tw": "鎖定頻道", "zh-cn": "锁定频道" },
  lol: { "zh-tw": "英雄聯盟", "zh-cn": "英雄联盟" },
  "member-notification": { "zh-tw": "成員通知", "zh-cn": "成员通知" },
  minecraft: { "zh-tw": "麥塊", "zh-cn": "我的世界" },
  pick: { "zh-tw": "選擇", "zh-cn": "选择" },
  poll: { "zh-tw": "投票", "zh-cn": "投票" },
  quote: { "zh-tw": "引用", "zh-cn": "引用消息" },
  random: { "zh-tw": "隨機抽籤", "zh-cn": "随机抽签" },
  "role-menu": { "zh-tw": "建立身分組選單", "zh-cn": "创建身份组菜单" },
  status: { "zh-tw": "機器人狀態", "zh-cn": "机器人状态" },
  ticket: { "zh-tw": "私人頻道", "zh-cn": "私人频道" },
};

export function createCmd(locale: Locale) {
  return function Cmd({ name }: { name: string }) {
    const display = commandNames[name.split(" ")[0]]?.[locale];

    if (!display) return <code>/{name}</code>;

    const label = locale === "zh-cn" ? "在 Discord 中显示为" : "在 Discord 中顯示為";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <code className="cursor-help underline decoration-dotted" />
            }
          >
            /{name}
          </TooltipTrigger>
          <TooltipContent>
            {label}「{display}」
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
}
