# Yeecord website

The source for [yeecord.com](https://yeecord.com), built with Fumadocs and Waku

The bot source lives in the sibling `yeecord` repository. This repository owns the website, docs, blog posts, static assets, and search index.

## Run locally

Install [Bun](https://bun.com), then run:

```sh
bun install
bun dev
```

The development site runs through Portless. Use the URL it prints rather than assuming a port.

## Verify changes

```sh
bun run typecheck
bun run build
```

`typecheck` validates MDX and TypeScript. Run `build` before changing routes, locale paths, or static-page behaviour.

## Content layout

- `content/docs/` contains product documentation
- `content/blog/` contains blog posts
- `content/legal/` contains legal pages
- `src/` contains pages, MDX components, and site UI

Documentation uses Traditional Chinese as the source locale. A Simplified Chinese version adds the `.zh-cn.mdx` suffix. Add a page to its directory's `meta.json` and `meta.zh-cn.json` to show it in the sidebar.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. It covers page structure, localized links, copy conventions, and checks.

## License

Documentation and blog content are available under [CC BY 4.0](LICENSE). Other source files are available under the [MIT License](LICENSE-CODE).
