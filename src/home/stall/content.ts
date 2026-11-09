/* 首頁夜市小遊戲自己的食材、食譜、像素圖和台詞，改編自機器人早期的遊戲原型 */

import type { Locale } from "~/i18n";

export type Taste = "salty" | "sweet" | "sour" | "spicy" | "umami";
export type Texture = "crispy" | "soft" | "chewy" | "soup";
export type Role =
  | "staple"
  | "protein"
  | "vegetable"
  | "sauce"
  | "drink"
  | "topping";
export type Rarity = "common" | "rare" | "legendary";
export type Origin = "market" | "coast" | "mountain";
export type Grade = "bronze" | "silver" | "gold";
export type IngredientId = "rice" | "pork_belly" | "soy_sauce" | "shallot" | "milkfish" | "oyster" | "sweet_potato_starch" | "egg" | "basil" | "chicken_chunk" | "boba" | "milk_tea" | "cilantro" | "pineapple" | "fishball_king";
export type RecipeId = "braised_pork_rice" | "oyster_omelette" | "popcorn_chicken" | "milkfish_congee" | "shallot_rice" | "bubble_tea" | "cilantro_bubble_tea" | "pineapple_braised_pork";

export type Ingredient = {
  id: IngredientId;
  tastes: Taste[];
  role: Role;
  textures: Texture[];
  rarity: Rarity;
  score: number;
  origin: Origin;
};

export type Recipe = {
  id: RecipeId;
  keys: IngredientId[];
  tastes: Taste[];
  roles: Role[];
  textures: Texture[];
  dark: boolean;
};

export const ORIGINS: Origin[] = ["market", "coast", "mountain"];

export const INGREDIENTS: Ingredient[] = [
  {"id": "rice", "tastes": [], "role": "staple", "textures": ["soft"], "rarity": "common", "score": 10, "origin": "market"},
  {"id": "pork_belly", "tastes": ["umami"], "role": "protein", "textures": ["soft"], "rarity": "common", "score": 15, "origin": "market"},
  {"id": "soy_sauce", "tastes": ["salty"], "role": "sauce", "textures": [], "rarity": "common", "score": 8, "origin": "market"},
  {"id": "shallot", "tastes": [], "role": "topping", "textures": ["crispy"], "rarity": "common", "score": 12, "origin": "market"},
  {"id": "milkfish", "tastes": ["umami"], "role": "protein", "textures": ["soft"], "rarity": "common", "score": 18, "origin": "coast"},
  {"id": "oyster", "tastes": ["umami"], "role": "protein", "textures": ["soft"], "rarity": "rare", "score": 30, "origin": "coast"},
  {"id": "sweet_potato_starch", "tastes": [], "role": "staple", "textures": ["chewy"], "rarity": "common", "score": 8, "origin": "market"},
  {"id": "egg", "tastes": ["umami"], "role": "protein", "textures": ["soft"], "rarity": "common", "score": 10, "origin": "market"},
  {"id": "basil", "tastes": [], "role": "vegetable", "textures": ["crispy"], "rarity": "common", "score": 12, "origin": "mountain"},
  {"id": "chicken_chunk", "tastes": ["umami"], "role": "protein", "textures": ["crispy"], "rarity": "common", "score": 15, "origin": "market"},
  {"id": "boba", "tastes": ["sweet"], "role": "topping", "textures": ["chewy"], "rarity": "common", "score": 12, "origin": "market"},
  {"id": "milk_tea", "tastes": ["sweet"], "role": "drink", "textures": [], "rarity": "common", "score": 12, "origin": "market"},
  {"id": "cilantro", "tastes": [], "role": "topping", "textures": [], "rarity": "common", "score": 9, "origin": "mountain"},
  {"id": "pineapple", "tastes": ["sweet", "sour"], "role": "vegetable", "textures": [], "rarity": "common", "score": 14, "origin": "mountain"},
  {"id": "fishball_king", "tastes": ["umami"], "role": "protein", "textures": ["chewy"], "rarity": "legendary", "score": 80, "origin": "coast"},
];

export const RECIPES: Recipe[] = [
  {"id": "braised_pork_rice", "keys": ["pork_belly", "rice"], "tastes": ["salty"], "roles": ["sauce"], "textures": [], "dark": false},
  {"id": "oyster_omelette", "keys": ["oyster", "egg"], "tastes": ["umami"], "roles": ["staple"], "textures": ["chewy"], "dark": false},
  {"id": "popcorn_chicken", "keys": ["chicken_chunk", "basil"], "tastes": ["salty"], "roles": [], "textures": ["crispy"], "dark": false},
  {"id": "milkfish_congee", "keys": ["milkfish", "rice"], "tastes": ["umami"], "roles": ["staple"], "textures": ["soft"], "dark": false},
  {"id": "shallot_rice", "keys": ["shallot", "rice"], "tastes": [], "roles": [], "textures": ["crispy"], "dark": false},
  {"id": "bubble_tea", "keys": ["boba", "milk_tea"], "tastes": ["sweet"], "roles": [], "textures": ["chewy"], "dark": false},
  {"id": "cilantro_bubble_tea", "keys": ["cilantro", "boba", "milk_tea"], "tastes": ["sweet"], "roles": [], "textures": [], "dark": true},
  {"id": "pineapple_braised_pork", "keys": ["pineapple", "pork_belly", "rice"], "tastes": ["sweet", "salty"], "roles": [], "textures": [], "dark": true},
];

export const SPRITE_PALETTE: Record<string, string> = {"0": "#33291B", "1": "#7A2A1C", "3": "#8A3320", "5": "#8d8470", "6": "#CC9A33", "7": "#AB4329", "9": "#EFE6CD", "a": "#E0C97a", "b": "#AB4329", "c": "#2E5E55", "e": "#F4EAD0"};

/** 每個食材一張，順序跟 INGREDIENTS 一樣，最後一張是 Yee 自己撿的驚喜 */
export const SPRITES: string[][] = [
  [".00000.", "0eeeee0", "0e090e0", "0eeeee0", "07b7b70", ".00000."],
  ["..000..", ".06660.", "0666660", "06bbb60", "0666660", ".06660.", "..000.."],
  ["..000..", "..0e0..", "..000..", ".03330.", ".03330.", ".03330.", ".00000."],
  ["..0.0..", ".06060.", "0666660", "0666660", ".06660.", "..000.."],
  [".00000.", "0666660", "0606660", "0666666", "0666660", ".00000."],
  ["..000..", ".0ccc0.", "0c999c0", "0c999c0", "0ccccc0", ".00000."],
  ["..00...", ".0ee0..", "0eeee0.", "0e99e0.", "0eeee0.", ".0000.."],
  ["..000..", ".0eee0.", "0eeeee0", "0e666e0", "0eeeee0", ".00000."],
  ["...0...", "..0c0..", ".0ccc0.", "0ccccc0", ".0ccc0.", "..000.."],
  [".00000.", "0666660", "06b6660", "0666b60", "0666660", ".00000."],
  [".00000.", "0eeeee0", "0eeeee0", "0e0e0e0", ".0000..", "..0.0.."],
  [".00000.", "0eeeee0", "0e666e0", "0e666e0", ".0000..", "..000.."],
  [".0c.c0.", ".0ccc0.", "0ccccc0", ".0ccc0.", "..0c0..", "...0..."],
  ["..c.c..", ".ccc...", ".0660..", "06a6660", "0666a60", ".0660.."],
  [".6.6.6.", ".66666.", ".0eee0.", "0eeeee0", "0e9e9e0", ".00000."],
  ["..000..", ".05550.", "0505050", "0505050", ".05550.", "..000.."],
];

export type Copy = {
  ingredient: Record<IngredientId, string>;
  recipe: Record<RecipeId, { name: string; comment: string }>;
  location: Record<Origin, { name: string; intel: string[] }>;
  taste: Record<Taste, string>;
  texture: Record<Texture, string>;
  role: Record<Role, string>;
  grade: Record<Grade, string>;
  rarity: Record<Rarity, string>;
  flop: string[];
  diary: string[];
  surprise: string[];
  text: Record<"home_shop" | "button_cookBook" | "cookBook_count" | "cookBook_title" | "cookBook_known" | "button_back" | "button_cook" | "report_intel_hit" | "report_surprise" | "cook_flop_title" | "cook_dark_stamp" | "cook_hint_key" | "cook_hint_missing" | "cook_synergy", string>;
};

export const COPY: Record<Locale, Copy> = {
  "zh-tw": {
    "ingredient": {
      "rice": "白飯",
      "pork_belly": "五花肉",
      "soy_sauce": "醬油",
      "shallot": "油蔥酥",
      "milkfish": "虱目魚",
      "oyster": "鮮蚵",
      "sweet_potato_starch": "地瓜粉",
      "egg": "雞蛋",
      "basil": "九層塔",
      "chicken_chunk": "雞塊肉",
      "boba": "粉圓",
      "milk_tea": "奶茶",
      "cilantro": "香菜",
      "pineapple": "鳳梨",
      "fishball_king": "魚丸王"
    },
    "recipe": {
      "braised_pork_rice": {
        "name": "滷肉飯",
        "comment": "Yee 認可。這是文明的基石。"
      },
      "oyster_omelette": {
        "name": "蚵仔煎",
        "comment": "黏黏的。Yee 喜歡黏黏的。"
      },
      "popcorn_chicken": {
        "name": "鹽酥雞",
        "comment": "九層塔是法律。"
      },
      "milkfish_congee": {
        "name": "虱目魚粥",
        "comment": "溫溫的。像星期天早上。"
      },
      "shallot_rice": {
        "name": "油蔥飯",
        "comment": "古早味。Yee 的阿嬤也這樣拌。"
      },
      "bubble_tea": {
        "name": "珍珠奶茶",
        "comment": "Yee 一口吞掉了所有珍珠。沒有後悔。"
      },
      "cilantro_bubble_tea": {
        "name": "香菜珍珠奶茶",
        "comment": "Yee 吃了。Yee 不想談這件事。"
      },
      "pineapple_braised_pork": {
        "name": "鳳梨滷肉飯",
        "comment": "甜的。鹹的。錯的。"
      }
    },
    "location": {
      "market": {
        "name": "傳統市場",
        "intel": [
          "肉攤大出清，五花肉堆成小山。今天撿到的算 ★★。",
          "隔壁攤剛炸好一鍋油蔥酥，整條街都香。今天撿到的算 ★★。",
          "蛋商多載了一車，雞蛋隨便挑。今天撿到的算 ★★。"
        ]
      },
      "coast": {
        "name": "海邊",
        "intel": [
          "今天浪大，虱目魚肥到誇張。撿到的算 ★★。",
          "退潮了，石頭縫裡全是鮮蚵。撿到的算 ★★。",
          "漁船剛回港，虱目魚新鮮到會彈。撿到的算 ★★。"
        ]
      },
      "mountain": {
        "name": "山裡",
        "intel": [
          "雨後的九層塔香氣衝鼻。今天撿到的算 ★★。",
          "山腰的鳳梨田熟了一整片。今天撿到的算 ★★。",
          "溪邊香菜長得比 Yee 的腳還高。今天撿到的算 ★★。"
        ]
      }
    },
    "taste": {
      "salty": "鹹",
      "sweet": "甜",
      "sour": "酸",
      "spicy": "辣",
      "umami": "鮮"
    },
    "texture": {
      "crispy": "脆",
      "soft": "軟",
      "chewy": "Q",
      "soup": "湯"
    },
    "role": {
      "staple": "主食",
      "protein": "蛋白質",
      "vegetable": "蔬菜",
      "sauce": "醬料",
      "drink": "飲料",
      "topping": "配料"
    },
    "grade": {
      "bronze": "普通",
      "silver": "好吃",
      "gold": "絕品"
    },
    "rarity": {
      "common": "普通",
      "rare": "稀有",
      "legendary": "傳說"
    },
    "flop": [
      "Yee 掃描這團東西。分類：未知。歸檔：待處理。",
      "偵測到食物的形狀。偵測不到食物。Yee 記下這個矛盾。",
      "Yee 戳了一下。它戳回來。雙方各退一步。",
      "判定中……判定失敗。Yee 決定假裝剛才什麼都沒發生。",
      "這不在 Yee 的資料庫。現在資料庫裡多了一團陰影。"
    ],
    "diary": [
      "今天風平浪靜。Yee 走得很穩。",
      "路上遇到一隻貓。牠們互相無視。",
      "天氣普通。收穫普通。Yee 覺得這樣就好。",
      "回程繞了點路。Yee 說是為了運動。",
      "袋子有點重。Yee 沒有喊累。"
    ],
    "surprise": [
      "一顆生鏽的彈珠",
      "半張過期票根",
      "一顆形狀奇怪的石頭"
    ],
    "text": {
      "home_shop": "夜 市 食 堂 · 今 日 營 業",
      "button_cookBook": "食譜本",
      "cookBook_count": "已收集{found}/{total}",
      "cookBook_title": "食譜本",
      "cookBook_known": "已知：{flavors}",
      "button_back": "回店裡",
      "button_cook": "開煮",
      "report_intel_hit": "情報應驗：{name} ★★",
      "report_surprise": "Yee 自己撿的",
      "cook_flop_title": "黑暗料理",
      "cook_dark_stamp": "醜",
      "cook_hint_key": "少了一樣關鍵的{role}。{origin}那邊找得到。",
      "cook_hint_missing": "缺一味{flavors}。往那個方向補。",
      "cook_synergy": "協同"
    }
  },
  "zh-cn": {
    "ingredient": {
      "rice": "白饭",
      "pork_belly": "五花肉",
      "soy_sauce": "酱油",
      "shallot": "油葱酥",
      "milkfish": "虱目鱼",
      "oyster": "鲜蚵",
      "sweet_potato_starch": "地瓜粉",
      "egg": "鸡蛋",
      "basil": "九层塔",
      "chicken_chunk": "鸡块肉",
      "boba": "粉圆",
      "milk_tea": "奶茶",
      "cilantro": "香菜",
      "pineapple": "菠萝",
      "fishball_king": "鱼丸王"
    },
    "recipe": {
      "braised_pork_rice": {
        "name": "卤肉饭",
        "comment": "Yee 认可。这是文明的基石。"
      },
      "oyster_omelette": {
        "name": "蚵仔煎",
        "comment": "黏黏的。Yee 喜欢黏黏的。"
      },
      "popcorn_chicken": {
        "name": "盐酥鸡",
        "comment": "九层塔是法律。"
      },
      "milkfish_congee": {
        "name": "虱目鱼粥",
        "comment": "温温的。像星期天早上。"
      },
      "shallot_rice": {
        "name": "油葱饭",
        "comment": "古早味。Yee 的阿嬷也这样拌。"
      },
      "bubble_tea": {
        "name": "珍珠奶茶",
        "comment": "Yee 一口吞掉了所有珍珠。没有后悔。"
      },
      "cilantro_bubble_tea": {
        "name": "香菜珍珠奶茶",
        "comment": "Yee 吃了。Yee 不想谈这件事。"
      },
      "pineapple_braised_pork": {
        "name": "菠萝卤肉饭",
        "comment": "甜的。咸的。错的。"
      }
    },
    "location": {
      "market": {
        "name": "传统市场",
        "intel": [
          "肉摊大出清，五花肉堆成小山。今天捡到的算 ★★。",
          "隔壁摊刚炸好一锅油葱酥，整条街都香。今天捡到的算 ★★。",
          "蛋商多载了一车，鸡蛋随便挑。今天捡到的算 ★★。"
        ]
      },
      "coast": {
        "name": "海边",
        "intel": [
          "今天浪大，虱目鱼肥到夸张。捡到的算 ★★。",
          "退潮了，石头缝里全是鲜蚵。捡到的算 ★★。",
          "渔船刚回港，虱目鱼新鲜到会弹。捡到的算 ★★。"
        ]
      },
      "mountain": {
        "name": "山里",
        "intel": [
          "雨后的九层塔香气冲鼻。今天捡到的算 ★★。",
          "山腰的菠萝田熟了一整片。今天捡到的算 ★★。",
          "溪边香菜长得比 Yee 的脚还高。今天捡到的算 ★★。"
        ]
      }
    },
    "taste": {
      "salty": "咸",
      "sweet": "甜",
      "sour": "酸",
      "spicy": "辣",
      "umami": "鲜"
    },
    "texture": {
      "crispy": "脆",
      "soft": "软",
      "chewy": "Q",
      "soup": "汤"
    },
    "role": {
      "staple": "主食",
      "protein": "蛋白质",
      "vegetable": "蔬菜",
      "sauce": "酱料",
      "drink": "饮料",
      "topping": "配料"
    },
    "grade": {
      "bronze": "普通",
      "silver": "好吃",
      "gold": "绝品"
    },
    "rarity": {
      "common": "普通",
      "rare": "稀有",
      "legendary": "传说"
    },
    "flop": [
      "Yee 扫描这团东西。分类：未知。归档：待处理。",
      "检测到食物的形状。检测不到食物。Yee 记下这个矛盾。",
      "Yee 戳了一下。它戳回来。双方各退一步。",
      "判定中……判定失败。Yee 决定假装刚才什么都没发生。",
      "这不在 Yee 的数据库里。现在数据库里多了一团阴影。"
    ],
    "diary": [
      "今天风平浪静。Yee 走得很稳。",
      "路上遇到一只猫。它们互相无视。",
      "天气普通。收获普通。Yee 觉得这样就好。",
      "回程绕了点路。Yee 说是为了运动。",
      "袋子有点重。Yee 没有喊累。"
    ],
    "surprise": [
      "一颗生锈的弹珠",
      "半张过期票根",
      "一颗形状奇怪的石头"
    ],
    "text": {
      "home_shop": "夜 市 食 堂 · 今 日 营 业",
      "button_cookBook": "食谱本",
      "cookBook_count": "已收集{found}/{total}",
      "cookBook_title": "食谱本",
      "cookBook_known": "已知：{flavors}",
      "button_back": "回店里",
      "button_cook": "开煮",
      "report_intel_hit": "情报应验：{name} ★★",
      "report_surprise": "Yee 自己捡的",
      "cook_flop_title": "黑暗料理",
      "cook_dark_stamp": "丑",
      "cook_hint_key": "少了一样关键的{role}。{origin}那边找得到。",
      "cook_hint_missing": "缺一味{flavors}。往那个方向补。",
      "cook_synergy": "协同"
    }
  },
  "en": {
    "ingredient": {
      "rice": "Rice",
      "pork_belly": "Pork Belly",
      "soy_sauce": "Soy Sauce",
      "shallot": "Fried Shallots",
      "milkfish": "Milkfish",
      "oyster": "Fresh Oyster",
      "sweet_potato_starch": "Sweet Potato Starch",
      "egg": "Egg",
      "basil": "Thai Basil",
      "chicken_chunk": "Chicken Chunk",
      "boba": "Tapioca Pearls",
      "milk_tea": "Milk Tea",
      "cilantro": "Cilantro",
      "pineapple": "Pineapple",
      "fishball_king": "Fishball King"
    },
    "recipe": {
      "braised_pork_rice": {
        "name": "Braised Pork Rice",
        "comment": "Yee approves. The bedrock of civilization."
      },
      "oyster_omelette": {
        "name": "Oyster Omelette",
        "comment": "Gooey. Yee likes gooey."
      },
      "popcorn_chicken": {
        "name": "Popcorn Chicken",
        "comment": "Thai basil is the law."
      },
      "milkfish_congee": {
        "name": "Milkfish Congee",
        "comment": "Warm. Like a Sunday morning."
      },
      "shallot_rice": {
        "name": "Fried Shallot Rice",
        "comment": "Old-school. Yee's grandma stirred it just like this."
      },
      "bubble_tea": {
        "name": "Bubble Tea",
        "comment": "Yee swallowed every pearl in one gulp. No regrets."
      },
      "cilantro_bubble_tea": {
        "name": "Cilantro Bubble Tea",
        "comment": "Yee ate it. Yee doesn't want to talk about it."
      },
      "pineapple_braised_pork": {
        "name": "Pineapple Braised Pork Rice",
        "comment": "Sweet. Salty. Wrong."
      }
    },
    "location": {
      "market": {
        "name": "The Market",
        "intel": [
          "Meat stall clearance — pork belly piled up high. Today's picks count as ★★.",
          "The next stall just fried a fresh batch of shallots. Today's picks count as ★★.",
          "The egg vendor over-ordered — eggs everywhere. Today's picks count as ★★."
        ]
      },
      "coast": {
        "name": "The Seaside",
        "intel": [
          "Big waves today — the milkfish are absurdly fat. Any you find count as ★★.",
          "Low tide — the rock crevices are full of oysters. Any you find count as ★★.",
          "The boats just docked — milkfish so fresh they bounce. Any you find count as ★★."
        ]
      },
      "mountain": {
        "name": "The Mountains",
        "intel": [
          "The basil smells sharp after the rain. Today's picks count as ★★.",
          "The pineapple field on the slope ripened all at once. Today's picks count as ★★.",
          "Riverside cilantro taller than Yee's legs. Today's picks count as ★★."
        ]
      }
    },
    "taste": {
      "salty": "Salty",
      "sweet": "Sweet",
      "sour": "Sour",
      "spicy": "Spicy",
      "umami": "Umami"
    },
    "texture": {
      "crispy": "Crispy",
      "soft": "Soft",
      "chewy": "Chewy",
      "soup": "Soupy"
    },
    "role": {
      "staple": "Staple",
      "protein": "Protein",
      "vegetable": "Vegetable",
      "sauce": "Sauce",
      "drink": "Drink",
      "topping": "Topping"
    },
    "grade": {
      "bronze": "Decent",
      "silver": "Tasty",
      "gold": "Divine"
    },
    "rarity": {
      "common": "Common",
      "rare": "Rare",
      "legendary": "Legendary"
    },
    "flop": [
      "Yee scans the blob. Category: unknown. Filed under: pending.",
      "Detected the shape of food. Did not detect food. Yee logs the contradiction.",
      "Yee pokes it. It pokes back. Both parties step away.",
      "Evaluating… evaluation failed. Yee elects to pretend that never happened.",
      "Not in Yee's database. The database now holds one additional shadow."
    ],
    "diary": [
      "Calm day. Yee walked steady.",
      "Passed a cat on the way. Mutual disregard.",
      "Ordinary weather. Ordinary haul. Yee considers that acceptable.",
      "Took the long way back. Yee calls it exercise.",
      "The bag got heavy. Yee did not complain."
    ],
    "surprise": [
      "A rusty marble",
      "Half an expired ticket stub",
      "An oddly shaped rock"
    ],
    "text": {
      "home_shop": "Night-Market Diner · Open Today",
      "button_cookBook": "Recipe Book",
      "cookBook_count": "Found {found}/{total}",
      "cookBook_title": "Recipe Book",
      "cookBook_known": "Known: {flavors}",
      "button_back": "Back",
      "button_cook": "Cook it",
      "report_intel_hit": "The intel paid off: {name} ★★",
      "report_surprise": "Yee found it",
      "cook_flop_title": "Mystery Dish",
      "cook_dark_stamp": "Ugh",
      "cook_hint_key": "Missing a key {role}. Try around {origin}.",
      "cook_hint_missing": "Missing a note of {flavors}. Work toward that.",
      "cook_synergy": "Synergy"
    }
  }
};
