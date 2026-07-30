# Contributing to the Yeecord website

This repository contains the website, documentation, blog posts, and static assets for yeecord.com

## Before editing

- Read the page you plan to change and its matching Simplified Chinese version
- Check the bot repository when a command, permission, or user flow is involved
- Keep one source of truth for each instruction. Link to a focused page instead of copying the same explanation

## Page structure

Each documentation page should answer one reader question

For an operation page, use this order:

1. State what the feature does and show the main command
2. List required permissions with `<CommandHeader />`
3. Explain the first useful action
4. Cover editing, daily management, and results only when they apply
5. Link to a related page or troubleshooting step when it unblocks the reader

Use headings for tasks, tables for fixed options, and MDX demos when an interaction needs to be shown. Do not open with marketing copy or repeat the page title in a paragraph.

## Localized docs

Traditional Chinese is the source document. Add the Simplified Chinese version with a `.zh-cn.mdx` suffix.

Add new pages to both `meta.json` and `meta.zh-cn.json`. Relative links such as `./form.mdx` stay in the current locale. Absolute documentation links must include the locale prefix:

```mdx
/zh-tw/docs/commands/form
/zh-cn/docs/commands/form
```

Do not link to `/docs/...`. That route does not exist in the static site.

## Copy

- Use short, concrete sentences
- Chinese UI and docs copy does not use full stops
- Split a long sentence into paragraphs or a list instead of adding semicolons
- Do not use promotional claims, filler, or unexplained jargon
- Keep command names, permissions, and limits exactly aligned with the bot

## Verify

Run these commands before opening a pull request:

```sh
bun run typecheck
bun run build
```

`typecheck` catches MDX and TypeScript errors. `build` verifies static routes, so run it after changing a link, page path, or locale.
