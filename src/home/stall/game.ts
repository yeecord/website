import {
  type Grade,
  INGREDIENTS,
  type Ingredient,
  type IngredientId,
  type Origin,
  ORIGINS,
  RECIPES,
  type Recipe,
  type RecipeId,
  type Role,
  type Taste,
  type Texture,
} from "./content";

export const POT_SIZE = 4;
const HARVEST_SIZE = 3;

const LEGENDARY_CHANCE = 0.25;
const GRADE_ORDER: Grade[] = ["bronze", "silver", "gold"];

/** 第一次去每個地點帶回的固定三樣，一定湊得出一道菜 */
const FIRST_HARVEST: Record<Origin, IngredientId[]> = {
  market: ["pork_belly", "rice", "soy_sauce"],
  coast: ["milkfish", "rice", "oyster"],
  mountain: ["chicken_chunk", "basil", "soy_sauce"],
};

/** 每個地點三則情報各自指向的食材，順序跟 COPY 的 intel 一樣 */
const INTEL_TARGETS: Record<Origin, IngredientId[]> = {
  market: ["pork_belly", "shallot", "egg"],
  coast: ["milkfish", "oyster", "milkfish"],
  mountain: ["basil", "pineapple", "cilantro"],
};

export type Stars = 1 | 2;

export type Save = {
  pantry: Partial<Record<IngredientId, Stars>>;
  book: Partial<Record<RecipeId, Grade>>;
  trips: Partial<Record<Origin, number>>;
  coins?: number;
};

export const EMPTY_SAVE: Save = { pantry: {}, book: {}, trips: {} };

export type Harvest = {
  origin: Origin;
  items: { id: IngredientId; stars: Stars; fresh: boolean }[];
  /** 沒湊滿三樣時，Yee 自己撿的東西在 COPY.surprise 的位置 */
  surprise: number | null;
  diary: number;
};

export type Hint =
  | { kind: "missing"; tastes: Taste[]; textures: Texture[]; roles: Role[] }
  | { kind: "key"; role: Role; origin: Origin };

export type Dish = {
  pot: IngredientId[];
  recipe: Recipe | null;
  total: number;
  grade: Grade;
  synergy: boolean;
  /** 這道菜第一次進食譜本 */
  fresh: boolean;
  hint: Hint | null;
  line: number;
};

export function ingredient(id: IngredientId): Ingredient {
  const found = INGREDIENTS.find((item) => item.id === id);

  if (!found) {
    throw new Error(`unknown ingredient ${id}`);
  }

  return found;
}

export function ingredientIndex(id: IngredientId): number {
  return INGREDIENTS.findIndex((item) => item.id === id);
}

/** 今天每個地點輪到哪一則情報 */
export function intelIndex(origin: Origin, day: number): number {
  return (day + ORIGINS.indexOf(origin)) % INTEL_TARGETS[origin].length;
}

export function today(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function forage(
  save: Save,
  origin: Origin,
  day: number,
  random: () => number,
): { save: Save; harvest: Harvest } {
  const trips = save.trips[origin] ?? 0;
  const target = INTEL_TARGETS[origin][intelIndex(origin, day)];
  const found =
    trips === 0 ? FIRST_HARVEST[origin] : laterHarvest(save, origin, random);
  const pantry = { ...save.pantry };
  const items = found.map((id) => {
    const stars: Stars = id === target ? 2 : 1;
    const fresh = pantry[id] === undefined;

    pantry[id] = pantry[id] === 2 ? 2 : stars;

    return { id, stars, fresh };
  });

  return {
    save: { ...save, pantry, trips: { ...save.trips, [origin]: trips + 1 } },
    harvest: {
      origin,
      items,
      surprise: items.length < HARVEST_SIZE ? Math.floor(random() * 3) : null,
      diary: Math.floor(random() * 5),
    },
  };
}

/** 沒撿過的優先，傳說食材要碰運氣 */
function laterHarvest(
  save: Save,
  origin: Origin,
  random: () => number,
): IngredientId[] {
  const pool = INGREDIENTS.filter((item) => item.origin === origin);
  const unseen = shuffle(
    pool.filter(
      (item) =>
        save.pantry[item.id] === undefined &&
        (item.rarity !== "legendary" || random() < LEGENDARY_CHANCE),
    ),
    random,
  );
  const seen = shuffle(
    pool.filter((item) => save.pantry[item.id] !== undefined),
    random,
  );
  const room = unseen.length > 0 ? HARVEST_SIZE : HARVEST_SIZE - 1;

  return [...unseen, ...seen].slice(0, room).map((item) => item.id);
}

function shuffle<T>(list: T[], random: () => number): T[] {
  const copy = [...list];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function conditionCount(recipe: Recipe): number {
  return recipe.tastes.length + recipe.roles.length + recipe.textures.length;
}

function missing(recipe: Recipe, pot: Ingredient[]) {
  return {
    keys: recipe.keys.filter((key) => !pot.some((item) => item.id === key)),
    tastes: recipe.tastes.filter(
      (taste) => !pot.some((item) => item.tastes.includes(taste)),
    ),
    textures: recipe.textures.filter(
      (texture) => !pot.some((item) => item.textures.includes(texture)),
    ),
    roles: recipe.roles.filter(
      (role) => !pot.some((item) => item.role === role),
    ),
  };
}

function missingCount(gap: ReturnType<typeof missing>): number {
  return (
    gap.keys.length + gap.tastes.length + gap.textures.length + gap.roles.length
  );
}

/** 對得上的食譜裡最講究的那一道：關鍵食材多的優先，再來是條件多的，再來是黑暗料理 */
function matchRecipe(pot: Ingredient[]): Recipe | null {
  const candidates = RECIPES.filter(
    (recipe) => missingCount(missing(recipe, pot)) === 0,
  ).sort(
    (a, b) =>
      b.keys.length - a.keys.length ||
      conditionCount(b) - conditionCount(a) ||
      Number(b.dark) - Number(a.dark) ||
      a.id.localeCompare(b.id),
  );

  return candidates[0] ?? null;
}

/** 最接近的那道正常料理還缺什麼，只說方向，不說菜名和食材名 */
function flopHint(pot: Ingredient[]): Hint | null {
  const closest = RECIPES.filter((recipe) => !recipe.dark)
    .map((recipe) => ({ recipe, gap: missing(recipe, pot) }))
    .filter(({ gap }) => missingCount(gap) > 0)
    .sort(
      (a, b) =>
        missingCount(a.gap) - missingCount(b.gap) ||
        conditionCount(b.recipe) - conditionCount(a.recipe),
    )[0];

  if (!closest) {
    return null;
  }

  const { keys, tastes, textures, roles } = closest.gap;

  if (tastes.length + textures.length + roles.length > 0) {
    return { kind: "missing", tastes, textures, roles };
  }

  const key = ingredient(keys[0]);

  return { kind: "key", role: key.role, origin: key.origin };
}

function isRelevant(recipe: Recipe, item: Ingredient): boolean {
  return (
    recipe.keys.includes(item.id) ||
    item.tastes.some((taste) => recipe.tastes.includes(taste)) ||
    item.textures.some((texture) => recipe.textures.includes(texture)) ||
    recipe.roles.includes(item.role)
  );
}

function gradeOf(total: number): Grade {
  if (total >= 150) {
    return "gold";
  }

  return total >= 60 ? "silver" : "bronze";
}

export function cook(
  save: Save,
  ids: IngredientId[],
  random: () => number,
): { save: Save; dish: Dish } {
  const pot = ids.map(ingredient);
  const recipe = matchRecipe(pot);
  const relevant = recipe ? pot.filter((item) => isRelevant(recipe, item)) : pot;
  const base = relevant.reduce((sum, item) => sum + item.score, 0);
  const stars =
    relevant.reduce((sum, item) => sum + (save.pantry[item.id] ?? 1), 0) /
    Math.max(relevant.length, 1);
  const synergy = ORIGINS.some(
    (origin) => relevant.filter((item) => item.origin === origin).length >= 3,
  );
  const total = Math.floor(
    base * (1 + (stars - 1) * 0.5) * (synergy ? 1.5 : 1),
  );
  const grade = gradeOf(total);
  const known = recipe ? save.book[recipe.id] : undefined;
  const best =
    known && GRADE_ORDER.indexOf(known) > GRADE_ORDER.indexOf(grade)
      ? known
      : grade;

  return {
    save: recipe
      ? { ...save, book: { ...save.book, [recipe.id]: best } }
      : save,
    dish: {
      pot: ids,
      recipe,
      total,
      grade,
      synergy,
      fresh: recipe !== null && known === undefined,
      hint: recipe ? null : flopHint(pot),
      line: Math.floor(random() * 5),
    },
  };
}
