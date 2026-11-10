"use client";

import Link from "fumadocs-core/link";
import { useState } from "react";
import { FeatureIcon } from "~/feature-icons";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  FEATURES,
  guildInstallUrl,
  PERMISSIONS,
  permissionsFor,
  PRESETS,
} from "~/features";
import { contentPath, type Locale, locales } from "~/i18n";
import { translator } from "~/i18n/translate";

const DEFAULT_PRESET = "community";

function matches(selected: Set<string>, features: string[]) {
  return (
    selected.size === features.length &&
    features.every((id) => selected.has(id))
  );
}

/** 上面選一組預設，下面同一張表可以再一項一項調，底部固定顯示權限總數和安裝按鈕 */
export function InstallPicker({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [selected, setSelected] = useState(
    () =>
      new Set(PRESETS.find((preset) => preset.id === DEFAULT_PRESET)?.features),
  );
  const permissions = permissionsFor(selected);
  const separator = locales[locale].cjk ? "、" : ", ";

  function toggle(id: string) {
    const next = new Set(selected);

    if (!next.delete(id)) {
      next.add(id);
    }

    setSelected(next);
  }

  return (
    <div className="picker">
      <div role="radiogroup" className="picker-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={matches(selected, preset.features)}
            onClick={() => setSelected(new Set(preset.features))}
          >
            <FeatureIcon id={preset.id} />
            <strong>{t(preset.title)}</strong>
            <span>{t(preset.story)}</span>
          </button>
        ))}
      </div>

      <table className="picker-table">
        {CATEGORY_ORDER.map((category) => (
          <tbody key={category}>
            <tr>
              <th colSpan={3} scope="rowgroup">
                {t(CATEGORIES[category])}
              </th>
            </tr>
            {FEATURES.filter((feature) => feature.category === category).map(
              (feature) => {
                const builtIn = feature.permissions.length === 0;
                const checked = builtIn || selected.has(feature.id);

                return (
                  <tr key={feature.id} data-checked={checked}>
                    <td>
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
                    </td>
                    <td>
                      {builtIn
                        ? t("不用多給權限")
                        : feature.permissions
                            .map((permission) =>
                              t(PERMISSIONS[permission].label),
                            )
                            .join(separator)}
                    </td>
                    <td>
                      <Link
                        href={contentPath(
                          locale,
                          `/docs/commands/${feature.docs}`,
                        )}
                      >
                        {t("教學")}
                      </Link>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        ))}
      </table>

      <div className="picker-bar">
        <details>
          <summary>
            {t("共 {count} 項權限").replace(
              "{count}",
              String(permissions.length),
            )}
          </summary>
          <p>
            {permissions
              .map((row) => t(PERMISSIONS[row.permission].label))
              .join(separator)}
          </p>
        </details>
        <a
          href={guildInstallUrl(selected)}
          target="_blank"
          rel="noreferrer"
          className="btn-chunky"
        >
          {t("帶我回家")}
        </a>
      </div>
    </div>
  );
}
