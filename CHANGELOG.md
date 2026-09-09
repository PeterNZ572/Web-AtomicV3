# Changelog

All notable changes to `@peternz572/cms` are documented here.

---

## [Unreleased]

### Added
- Page builder MCP server (`src/mcp/`) — lets an AI assistant build, edit, structure and style pages through the content builder over the Payload Local API. 13 tools covering schema discovery, page CRUD, targeted structural edits, media uploads and site-wide settings. See `src/mcp/README.md`
- `npm run mcp` script and project-scoped `.mcp.json` so MCP clients pick the server up from the repo root
- Block and builder schemas are introspected from the live Payload config, so site-specific blocks added via `additionalBlocks` are exposed automatically

---

## [0.1.0] — 2026-06-28

### Added
- `createAtomicCMSPlugin(config)` — main Payload plugin entry point (`src/plugin.ts`)
- Plugin supports `additionalCollections`, `additionalBlocks`, `features` toggles, and `admin` branding config
- `createPagesCollection(additionalBlocks)` — factory that builds the Pages collection with any extra blocks merged in
- `createContentBuilderField(blocks)` — factory for the section/row/column builder field
- CMS Version admin panel — shows current vs latest version, triggers Coolify redeploy
- Backup manager — R2 uploads, cron scheduling, admin UI, history log

### Changed
- Package renamed from `atomic-cms` to `@peternz572/cms`; published to GitHub Packages
- Platform code (collections, globals, blocks, admin components) is now importable as a Payload plugin
- `src/_site-specific/` holds the Atomic Digital site code — to be moved to a separate repo in Phase 2
- Removed hardcoded Atomic Digital defaults from `email.ts` and `seo.ts`
- Sitemap now queries `pages` collection only by default (no `/projects/*` routes)

### Migration notes
- `payload.config.ts` now uses `createAtomicCMSPlugin()` — see the file for the expected shape
- Consuming sites must add `transpilePackages: ['@peternz572/cms']` to `next.config.mjs`
- Consuming sites must add the package source to Tailwind's `content` paths:
  `'./node_modules/@peternz572/cms/src/**/*.{ts,tsx}'`
- Run `npm run generate:types` after installing or updating the package

---

## [Unreleased]

_(Next changes go here before the next release)_
