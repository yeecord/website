"use client";

import Link from "fumadocs-core/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type Feature,
  FEATURES,
  guildInstallUrl,
  PERMISSIONS,
  permissionsFor,
  PRESETS,
} from "~/features";
import { FeatureIcon } from "~/feature-icons";
import { contentPath, type Locale, locales } from "~/i18n";
import { translator } from "~/i18n/translate";

const DEFAULT_PRESET = "community";

function presetFeatures(id: string | null): string[] {
  return (
    PRESETS.find((preset) => preset.id === id) ??
    PRESETS.find((preset) => preset.id === DEFAULT_PRESET)
  )?.features ?? [];
}

export function InstallPicker({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [selected, setSelected] = useState(
    () => new Set(presetFeatures(null)),
  );
  const permissions = permissionsFor(selected);
  const href = guildInstallUrl(selected);
  const separator = locales[locale].cjk ? "、" : ", ";
  const total = t("共 {count} 項權限").replace(
    "{count}",
    String(permissions.length),
  );

  useEffect(() => {
    const preset = new URLSearchParams(location.search).get("preset");

    if (preset) {
      setSelected(new Set(presetFeatures(preset)));
    }
  }, []);

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
      <li key={feature.id} data-checked={checked}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            disabled={builtIn}
            onChange={() => toggle(feature.id)}
          />
          <FeatureIcon id={feature.id} />
          <span>
            <strong>{t(feature.title)}</strong>
            <span>{t(feature.pitch)}</span>
          </span>
        </label>
        <p>
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
    <div className="picker">
      <div className="picker-list">
        {CATEGORY_ORDER.map((category) => (
          <section key={category}>
            <h2>{t(CATEGORIES[category])}</h2>
            <ul>
              {FEATURES.filter((feature) => feature.category === category).map(
                row,
              )}
            </ul>
          </section>
        ))}
      </div>

      <aside className="picker-receipt">
        <h2>{t("機器龍會要的權限")}</h2>
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
        <p className="picker-total">{total}</p>
        <p className="picker-hint">
          {t("少勾的之後可以補。缺了哪些，機器龍會在 /help 的設定頁提醒你")}
        </p>
        <a href={href} target="_blank" rel="noreferrer" className="btn-chunky">
          {t("帶我回家")}
        </a>
      </aside>

      <div className="picker-bar">
        <span>{total}</span>
        <a href={href} target="_blank" rel="noreferrer" className="btn-chunky">
          {t("帶我回家")}
        </a>
      </div>
    </div>
  );
}
