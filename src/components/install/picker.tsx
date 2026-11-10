"use client";

import Link from "fumadocs-core/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  CATEGORIES,
  type Category,
  type Feature,
  FEATURES,
  type Permission,
  PERMISSIONS,
  REQUIRED_PERMISSIONS,
} from "~/features";
import { contentPath, type Locale, locales } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";

const CLIENT_ID = "584213384409382953";
const OPTIONAL = FEATURES.filter((feature) => feature.permissions.length > 0);
const USER_COMMANDS = ["/poll", "/pick", "/bullshit"];
const CATEGORY_ORDER: Category[] = ["welcome", "voice", "moderation", "events"];

/** 依伺服器的樣子先幫忙勾好，之後還能一項一項調 */
const PRESETS: { id: string; title: Phrase; hint: Phrase; features: string[] }[] =
  [
    {
      id: "friends",
      title: "朋友小群",
      hint: "幾個熟人聊天、開語音",
      features: ["voice", "lock", "role-menu"],
    },
    {
      id: "community",
      title: "遊戲或興趣社群",
      hint: "常有新成員，要分身分組、擋廣告",
      features: ["voice", "auto-role", "role-menu", "defense"],
    },
    {
      id: "public",
      title: "公開大群",
      hint: "人多，管理和防護都要",
      features: OPTIONAL.map((feature) => feature.id),
    },
    {
      id: "basic",
      title: "先裝基本的",
      hint: "只用抽獎、投票和成員通知",
      features: [],
    },
  ];

type Mode = "guild" | "user";

function installUrl(mode: Mode, permissions: Permission[]) {
  if (mode === "user") {
    return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&integration_type=1&scope=applications.commands`;
  }

  const bits = permissions.reduce(
    (sum, permission) => sum | PERMISSIONS[permission].bit,
    0n,
  );

  return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=${bits}`;
}

/** 必要權限在前，後面接勾選的功能要的權限，每項附上是哪些功能要的 */
function asked(selected: Set<string>) {
  const chosen = OPTIONAL.filter((feature) => selected.has(feature.id));
  const extra = chosen
    .flatMap((feature) => feature.permissions)
    .filter(
      (permission, index, all) =>
        all.indexOf(permission) === index &&
        !REQUIRED_PERMISSIONS.includes(permission),
    );

  return [...REQUIRED_PERMISSIONS, ...extra].map((permission) => ({
    permission,
    features: chosen.filter((feature) =>
      feature.permissions.includes(permission),
    ),
  }));
}

function matches(selected: Set<string>, features: string[]) {
  return (
    selected.size === features.length &&
    features.every((id) => selected.has(id))
  );
}

export function InstallPicker({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("guild");
  const [selected, setSelected] = useState(
    () => new Set(PRESETS[1]?.features),
  );
  const permissions = asked(selected);
  const href = installUrl(
    mode,
    permissions.map((row) => row.permission),
  );
  const go = mode === "guild" ? t("帶我回家") : t("安裝到我的帳號");
  const separator = locales[locale].cjk ? "、" : ", ";
  const total = t("共 {count} 項權限").replace(
    "{count}",
    String(permissions.length),
  );

  function toggle(id: string) {
    const next = new Set(selected);

    if (!next.delete(id)) {
      next.add(id);
    }

    setSelected(next);
  }

  function row(feature: Feature) {
    const builtIn = feature.permissions.length === 0;
    const checked = builtIn || selected.has(feature.id);

    return (
      <li key={feature.id} className="order-row" data-checked={checked}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            disabled={builtIn}
            onChange={() => toggle(feature.id)}
          />
          <span className="order-name">
            <strong>{t(feature.title)}</strong>
            <span>{t(feature.pitch)}</span>
          </span>
        </label>
        <p className="order-meta">
          <span>
            {builtIn
              ? t("不用多給權限")
              : `${t("需要")} ${feature.permissions
                  .map((permission) => t(PERMISSIONS[permission].label))
                  .join(separator)}`}
          </span>
          <Link href={contentPath(locale, `/docs/commands/${feature.docs}`)}>
            {t("教學")}
          </Link>
        </p>
      </li>
    );
  }

  return (
    <div className="order">
      <div
        role="radiogroup"
        aria-label={t("安裝 YEE 式機器龍")}
        className="order-mode"
      >
        {(
          [
            ["guild", t("裝進伺服器")],
            ["user", t("裝到我的帳號")],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "guild" ? (
        <ol className="order-steps">
          <li>
            <h2>{t("你的伺服器比較像哪一種")}</h2>
            <div role="radiogroup" className="order-presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={matches(selected, preset.features)}
                  onClick={() => setSelected(new Set(preset.features))}
                >
                  <strong>{t(preset.title)}</strong>
                  <span>{t(preset.hint)}</span>
                </button>
              ))}
            </div>
          </li>
          <li>
            <h2>{t("照自己的需要調整")}</h2>
            <div className="order-sheet">
              {CATEGORY_ORDER.map((category) => (
                <section key={category}>
                  <h3>{t(CATEGORIES[category])}</h3>
                  <ul>
                    {FEATURES.filter(
                      (feature) => feature.category === category,
                    ).map(row)}
                  </ul>
                </section>
              ))}
            </div>
          </li>
        </ol>
      ) : (
        <div className="order-sheet">
          <section>
            <h3>{t("跟著你走，不用進伺服器")}</h3>
            <p>
              {t(
                "裝在自己的 Discord 帳號上，私訊、群組、任何伺服器都能叫出機器龍。發起投票、查個人卡片，走到哪用到哪。",
              )}
            </p>
            <p>{t("這個模式碰不到伺服器設定，所以一個權限都不用給。")}</p>
            <p className="font-mono text-sm">{USER_COMMANDS.join("　")}</p>
          </section>
        </div>
      )}

      <aside className="order-receipt">
        <h2>
          {mode === "guild" ? t("確認權限，然後安裝") : t("不需要任何權限")}
        </h2>
        {mode === "guild" ? (
          <>
            <ul>
              <AnimatePresence initial={false}>
                {permissions.map(({ permission, features }) => (
                  <motion.li
                    key={permission}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <span>
                      <strong>{t(PERMISSIONS[permission].label)}</strong>
                      <small>
                        {features.length > 0
                          ? features
                              .map((feature) => t(feature.title))
                              .join(separator)
                          : t("必要")}
                      </small>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <p className="order-total">{total}</p>
            <p className="order-hint">
              {t(
                "少勾的之後可以補。缺了哪些，機器龍會在 /help 的設定頁提醒你",
              )}
            </p>
          </>
        ) : null}
        <a href={href} target="_blank" rel="noreferrer" className="order-go">
          {go}
        </a>
      </aside>

      <div className="order-bar">
        {mode === "guild" ? <span>{total}</span> : null}
        <a href={href} target="_blank" rel="noreferrer" className="order-go">
          {go}
        </a>
      </div>
    </div>
  );
}
