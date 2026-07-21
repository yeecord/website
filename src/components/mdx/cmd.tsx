import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 顯示名稱同步自 yeecord repo src/infrastructure/i18n/{zh-TW,zh-CN}.json 的 slash.*.name
export const commandNames: Record<string, { tw: string; cn: string }> = {
  "1a2b": { tw: "1a2b", cn: "1a2b" },
  "afk-channel": { tw: "afk-channel", cn: "afk-channel" },
  "auto-channels": { tw: "動態語音頻道", cn: "動態語音頻道" },
  "auto-role": { tw: "新成員身分組", cn: "新成员身份组" },
  avatar: { tw: "頭貼", cn: "头像" },
  banner: { tw: "旗幟", cn: "旗帜" },
  "bot-fight": { tw: "bot-fight", cn: "bot-fight" },
  bullshit: { tw: "唬爛產生器", cn: "胡说八道生成器" },
  clear: { tw: "大量刪除訊息", cn: "大量删除消息" },
  feedback: { tw: "回報", cn: "反馈" },
  form: { tw: "表單", cn: "表单" },
  "find-food": { tw: "找吃的", cn: "找吃的" },
  giveaway: { tw: "抽獎", cn: "抽奖" },
  guild: { tw: "伺服器資訊", cn: "服务器信息" },
  help: { tw: "幫助", cn: "帮助" },
  "lock-channel": { tw: "鎖定頻道", cn: "锁定频道" },
  lol: { tw: "英雄聯盟", cn: "英雄联盟" },
  "member-notification": { tw: "成員通知", cn: "成员通知" },
  minecraft: { tw: "minecraft", cn: "我的世界" },
  pick: { tw: "選擇", cn: "选择" },
  poll: { tw: "投票", cn: "投票" },
  profile: { tw: "我的資訊", cn: "我的信息" },
  quote: { tw: "引用", cn: "引用消息" },
  random: { tw: "隨機抽籤", cn: "随机抽签" },
  "role-menu": { tw: "建立身分組選單", cn: "创建身份组菜单" },
  status: { tw: "機器人狀態", cn: "机器人状态" },
  ticket: { tw: "私人頻道", cn: "私人频道" },
};

export function createCmd(locale: "tw" | "cn") {
  return function Cmd({ name }: { name: string }) {
    const display = commandNames[name.split(" ")[0]]?.[locale];

    if (!display) return <code>/{name}</code>;

    const label = locale === "cn" ? "在 Discord 中显示为" : "在 Discord 中顯示為";

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
