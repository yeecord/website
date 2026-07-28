"use client";

import { Check, Server, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { InstallCopy } from "~/install/copy";
import { cn } from "~/utils/cn";

const CLIENT_ID = "584213384409382953";

// https://discord.com/developers/docs/topics/permissions
const requiredBits =
  (1n << 10n) | // VIEW_CHANNEL
  (1n << 11n) | // SEND_MESSAGES
  (1n << 15n) | // ATTACH_FILES, the rendered cards are uploaded as images
  (1n << 16n) | // READ_MESSAGE_HISTORY, prefix commands answer as a reply
  (1n << 18n); // USE_EXTERNAL_EMOJIS

type FeatureId = keyof InstallCopy["picker"]["features"];

// bits line up with the permission names of the same feature in copy.ts
const features: { id: FeatureId; bits: bigint[] }[] = [
  { id: "voice", bits: [1n << 4n, 1n << 20n, 1n << 24n] },
  { id: "roles", bits: [1n << 28n] },
  { id: "messages", bits: [1n << 13n] },
  { id: "ticket", bits: [1n << 36n, 1n << 38n, 1n << 34n] },
  { id: "defense", bits: [1n << 2n, 1n << 40n, 1n << 13n] },
  { id: "mention", bits: [1n << 17n] },
];

function installUrl(mode: "guild" | "user", selected: Set<string>) {
  if (mode === "user")
    return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&integration_type=1&scope=applications.commands`;

  let bits = requiredBits;

  for (const feature of features) {
    if (!selected.has(feature.id)) continue;

    for (const bit of feature.bits) bits |= bit;
  }

  return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=${bits}`;
}

function Chip({
  muted,
  className,
  children,
}: {
  muted?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-md bg-fd-muted px-2 py-0.5 text-fd-muted-foreground text-xs transition-colors",
        muted && "opacity-50",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-fd-border bg-fd-background",
      )}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  );
}

export function InstallPicker({ copy }: { copy: InstallCopy["picker"] }) {
  const [mode, setMode] = useState<"guild" | "user">("guild");
  const [selected, setSelected] = useState(
    () => new Set(features.map((feature) => feature.id)),
  );

  function toggle(id: FeatureId) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto flex rounded-lg border bg-fd-muted/50 p-1 font-medium text-sm">
        {(
          [
            ["guild", <Server key="i" className="size-4" />, copy.guildTab],
            ["user", <User key="i" className="size-4" />, copy.userTab],
          ] as const
        ).map(([value, icon, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-5 py-2 transition-colors",
              mode === value
                ? "bg-fd-background text-fd-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {mode === "guild" ? (
        <>
          <div className="rounded-2xl border bg-fd-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{copy.requiredTitle}</h2>
              <span className="text-fd-muted-foreground text-xs">
                {copy.requiredBadge}
              </span>
            </div>
            <p className="mt-1 text-fd-muted-foreground text-sm">
              {copy.requiredNote}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {copy.requiredPermissions.map((permission) => (
                <Chip key={permission}>{permission}</Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const checked = selected.has(feature.id);
              const text = copy.features[feature.id];

              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggle(feature.id)}
                  aria-pressed={checked}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-colors",
                    checked
                      ? "border-primary/50 bg-fd-card"
                      : "bg-fd-card/50 hover:bg-fd-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2
                      className={cn(
                        "font-semibold transition-colors",
                        !checked && "text-fd-muted-foreground",
                      )}
                    >
                      {text.title}
                    </h2>
                    <Checkbox checked={checked} />
                  </div>
                  <p className="mt-1 text-fd-muted-foreground text-sm">
                    {text.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {text.permissions.map((permission) => (
                      <Chip key={permission} muted={!checked}>
                        {permission}
                      </Chip>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border bg-fd-card p-6">
          <h2 className="font-semibold">{copy.userTitle}</h2>
          <p className="mt-2 text-fd-muted-foreground text-sm">
            {copy.userBody}
          </p>
          <p className="mt-2 text-fd-muted-foreground text-sm">
            {copy.userNote}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["/poll", "/find-food", "/pick", "/bullshit"].map(
              (command) => (
                <Chip key={command} className="font-mono">
                  {command}
                </Chip>
              ),
            )}
          </div>
        </div>
      )}

      <a
        href={installUrl(mode, selected)}
        target="_blank"
        rel="noreferrer"
        className="btn-chunky mx-auto px-10"
      >
        {mode === "guild" ? copy.guildCta : copy.userCta}
      </a>
    </div>
  );
}
