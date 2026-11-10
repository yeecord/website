"use client";

import Link from "fumadocs-core/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type Feature,
  FEATURES,
  type Permission,
  PERMISSIONS,
  REQUIRED_PERMISSIONS,
} from "~/features";
import { contentPath, type Locale, locales } from "~/i18n";
import { translator } from "~/i18n/translate";

const CLIENT_ID = "584213384409382953";
const BUILT_IN = FEATURES.filter((feature) => feature.permissions.length === 0);
const OPTIONAL = FEATURES.filter((feature) => feature.permissions.length > 0);
const USER_COMMANDS = ["/poll", "/pick", "/bullshit"];

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

export function InstallPicker({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("guild");
  const [selected, setSelected] = useState(
    () => new Set(OPTIONAL.map((feature) => feature.id)),
  );
  const permissions = asked(selected);
  const everything = selected.size === OPTIONAL.length;
  const href = installUrl(
    mode,
    permissions.map((row) => row.permission),
  );
  const go = mode === "guild" ? t("帶我回家") : t("安裝到我的帳號");
  const separator = locales[locale].cjk ? "、" : ", ";

  function toggle(id: string) {
    const next = new Set(selected);

    if (!next.delete(id)) {
      next.add(id);
    }

    setSelected(next);
  }

  function row(feature: Feature, checked: boolean | null) {
    return (
      <li key={feature.id} className="order-row" data-checked={checked ?? true}>
        <label>
          {checked === null ? (
            <span className="order-stamp" role="img" aria-label={t("內建")} />
          ) : (
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(feature.id)}
            />
          )}
          <span className="order-name">
            <strong>{t(feature.title)}</strong>
            <span>{t(feature.pitch)}</span>
          </span>
        </label>
        <p className="order-meta">
          {feature.permissions.length > 0 ? (
            <span>
              {t("需要")}{" "}
              {feature.permissions
                .map((permission) => t(PERMISSIONS[permission].label))
                .join(separator)}
            </span>
          ) : null}
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

      <div className="order-sheet">
        {mode === "guild" ? (
          <>
            <div className="order-head">
              <h2>{t("要多給權限的功能")}</h2>
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    new Set(
                      everything ? [] : OPTIONAL.map((feature) => feature.id),
                    ),
                  )
                }
              >
                {everything ? t("全部取消") : t("全部勾選")}
              </button>
            </div>
            <ul>
              {OPTIONAL.map((feature) => row(feature, selected.has(feature.id)))}
            </ul>
            <div className="order-head">
              <h2>{t("內建的功能")}</h2>
              <span>{t("不用多給權限")}</span>
            </div>
            <ul>{BUILT_IN.map((feature) => row(feature, null))}</ul>
          </>
        ) : (
          <>
            <div className="order-head">
              <h2>{t("跟著你走，不用進伺服器")}</h2>
            </div>
            <p>
              {t(
                "裝在自己的 Discord 帳號上，私訊、群組、任何伺服器都能叫出機器龍。發起投票、查個人卡片，走到哪用到哪。",
              )}
            </p>
            <p>{t("這個模式碰不到伺服器設定，所以一個權限都不用給。")}</p>
            <p className="order-meta font-mono">{USER_COMMANDS.join("　")}</p>
          </>
        )}
      </div>

      <aside className="order-receipt">
        <h2>{t("機器龍會要的權限")}</h2>
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
            <p className="order-total">
              {t("共 {count} 項權限").replace(
                "{count}",
                String(permissions.length),
              )}
            </p>
            <p className="order-hint">
              {t(
                "少勾的之後可以補。缺了哪些，機器龍會在 /help 的設定頁提醒你",
              )}
            </p>
          </>
        ) : (
          <p className="order-total">{t("不需要任何權限")}</p>
        )}
        <a href={href} target="_blank" rel="noreferrer" className="order-go">
          {go}
        </a>
      </aside>

      <div className="order-bar">
        {mode === "guild" ? (
          <span>
            {t("共 {count} 項權限").replace("{count}", String(permissions.length))}
          </span>
        ) : null}
        <a href={href} target="_blank" rel="noreferrer" className="order-go">
          {go}
        </a>
      </div>
    </div>
  );
}
