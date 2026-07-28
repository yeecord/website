const zhTW = {
  meta: {
    title: "安裝 YEE 式機器龍",
    description:
      "權限自己勾，勾多少拿多少。也可以裝到自己的帳號上，私訊和任何伺服器都能用。",
  },
  mascotAlt: "YEE 式機器龍",
  headingPrefix: "快來把我",
  headingHighlight: "帶回家",
  headingSuffix: "！",
  subtitle: "權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。",
  picker: {
    guildTab: "裝進伺服器",
    userTab: "裝到我的帳號",
    requiredTitle: "必要權限",
    requiredBadge: "一定要帶",
    requiredNote: "看得到頻道、說得了話。少了這些，機器龍進來也只能當雕像。",
    requiredPermissions: [
      "檢視頻道",
      "傳送訊息",
      "閱讀歷史訊息",
      "嵌入連結",
      "附加檔案",
      "使用外部表情符號",
      "新增反應",
    ],
    features: {
      voice: {
        title: "動態語音頻道",
        description: "有人進語音就開一間專屬房間，人走了自動收。",
        permissions: ["管理頻道", "連接", "移動成員"],
      },
      roles: {
        title: "身分組",
        description: "新成員進來自動發，或讓成員自己按按鈕領。",
        permissions: ["管理身分組"],
      },
      messages: {
        title: "訊息管理",
        description: "洗版訊息一次清掉，最多一千則。",
        permissions: ["管理訊息"],
      },
      ticket: {
        title: "私人頻道",
        description: "成員按一顆按鈕，就能私下找管理員。",
        permissions: ["管理討論串", "建立私人討論串", "在討論串中傳送訊息"],
      },
      defense: {
        title: "機器人防禦",
        description: "廣告機器人一發言就封鎖，詐騙圖片自動攔下。",
        permissions: ["封鎖成員", "禁言成員"],
      },
    },
    userTitle: "跟著你走，不用進伺服器",
    userBody:
      "裝在自己的 Discord 帳號上，私訊、群組、任何伺服器都能叫出機器龍。發起投票、查個人卡片、玩找吃的，走到哪用到哪。",
    userNote: "這個模式碰不到伺服器設定，所以一個權限都不用給。",
    guildCta: "帶我回家",
    userCta: "安裝到我的帳號",
  },
};

export type InstallCopy = typeof zhTW;

const zhCN: InstallCopy = {
  meta: {
    title: "安装 YEE 式机器龙",
    description:
      "权限自己勾，勾多少拿多少。也可以装到自己的账号上，私信和任何服务器都能用。",
  },
  mascotAlt: "YEE 式机器龙",
  headingPrefix: "快来把我",
  headingHighlight: "带回家",
  headingSuffix: "！",
  subtitle: "权限自己勾，勾多少拿多少。不放心的先不给，之后随时能补。",
  picker: {
    guildTab: "装进服务器",
    userTab: "装到我的账号",
    requiredTitle: "必要权限",
    requiredBadge: "一定要带",
    requiredNote: "看得到频道、说得了话。少了这些，机器龙进来也只能当雕像。",
    requiredPermissions: [
      "查看频道",
      "发送消息",
      "阅读历史消息",
      "嵌入链接",
      "附加文件",
      "使用外部表情",
      "添加反应",
    ],
    features: {
      voice: {
        title: "动态语音频道",
        description: "有人进语音就开一间专属房间，人走了自动收。",
        permissions: ["管理频道", "连接", "移动成员"],
      },
      roles: {
        title: "身份组",
        description: "新成员进来自动发，或让成员自己按按钮领。",
        permissions: ["管理身份组"],
      },
      messages: {
        title: "消息管理",
        description: "刷屏消息一次清掉，最多一千条。",
        permissions: ["管理消息"],
      },
      ticket: {
        title: "私密频道",
        description: "成员按一颗按钮，就能私下找管理员。",
        permissions: ["管理子区", "创建私密子区", "在子区发送消息"],
      },
      defense: {
        title: "机器人防御",
        description: "广告机器人一发言就封禁，诈骗图片自动拦下。",
        permissions: ["封禁成员", "禁言成员"],
      },
    },
    userTitle: "跟着你走，不用进服务器",
    userBody:
      "装在自己的 Discord 账号上，私信、群组、任何服务器都能叫出机器龙。发起投票、查个人卡片、玩找吃的，走到哪用到哪。",
    userNote: "这个模式碰不到服务器设置，所以一个权限都不用给。",
    guildCta: "带我回家",
    userCta: "安装到我的账号",
  },
};

export const installCopy = { "zh-tw": zhTW, "zh-cn": zhCN };
