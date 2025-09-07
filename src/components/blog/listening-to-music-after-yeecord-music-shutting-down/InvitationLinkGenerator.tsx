"use client";

import { LinkButton } from "@/components/mdx/LinkButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import React, { useMemo, useRef, useState } from "react";

const BASE_URL =
  "https://discord.com/oauth2/authorize?permissions=274881071104&integration_type=0&scope=bot+applications.commands";

export function InvitationLinkGenerator() {
  const [clientId, setClientId] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLInputElement | null>(null);

  const inviteUrl = useMemo(() => {
    const id = clientId.trim();
    if (!id) return "";
    return `${BASE_URL}&client_id=${encodeURIComponent(id)}`;
  }, [clientId]);

  const selectAll = () => {
    const el = outputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(0, el.value.length);
  };

  const copyToClipboard = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      selectAll();
    } catch {
      // fallback: leave selection so user can CMD/CTRL+C
      selectAll();
    }
  };

  return (
    <div className="not-prose my-4 grid gap-3 p-4 bg-accent rounded-xl">
      <h4 className="text-lg text-accent-foreground">邀請連結生成器</h4>
      <div className="grid gap-1">
        <label htmlFor="clientId" className="text-sm font-medium text-foreground">
          Client ID
        </label>
        <input
          id="clientId"
          name="clientId"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="貼上你剛剛複製的 Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value.replace(/\D+/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inviteUrl) {
              copyToClipboard();
            }
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-2">
        <div className="grid gap-1">
          <label htmlFor="inviteUrl" className="text-sm font-medium text-foreground">
            邀請連結
          </label>
          <input
            id="inviteUrl"
            ref={outputRef}
            readOnly
            value={inviteUrl}
            placeholder="輸入 Client ID 以產生連結"
            onFocus={selectAll}
            onClick={selectAll}
            className="w-full cursor-text select-text rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            aria-readonly
            aria-label="產生的 Discord 機器人邀請連結"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!inviteUrl}
            className={cn(
              buttonVariants({ color: "primary" }),
              !inviteUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {copied ? "已複製！" : "複製連結"}
          </button>
          {inviteUrl && (
            <LinkButton
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              邀請你的機器人
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvitationLinkGenerator;
