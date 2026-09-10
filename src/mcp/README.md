# Page Builder MCP Server

An MCP server that lets an AI assistant build, edit, structure and style pages
through the Atomic content builder.

It ships with two transports that expose exactly the same tools:

| | **stdio** | **HTTP** |
|---|---|---|
| Entry point | `src/mcp/server.ts` | `src/app/api/mcp/route.ts` |
| Edits | the database `DATABASE_URI` points at | the deployed site it runs on |
| Auth | none — it's a local process | `MCP_SECRET` bearer token |
| Cache purging | no (see below) | yes — edits go live immediately |
| Use it for | local development | editing the live site |

Both talk to Payload over the **Local API**, so neither needs the site to be
reachable over the network from the client's side.

**Why the HTTP transport exists:** pages are cached by `unstable_cache` with
`revalidate: 3600` (`src/lib/content.ts`), and the `afterChange` hook on the
Pages collection purges that cache with `revalidateTag`. `revalidateTag` only
works inside a Next.js server process. A stdio server pointed at a production
database would therefore write successfully but leave the live site serving
stale HTML for up to an hour — the hook's `try/catch` swallows the error. The
HTTP transport runs *inside* Next.js, so the purge fires and edits appear at
once.

## Setup — stdio (local development)

The repo ships a project-scoped [`.mcp.json`](../../.mcp.json), so Claude Code
picks the server up automatically when you approve it in this directory.

To register it elsewhere:

```bash
claude mcp add atomic-page-builder -- npx tsx src/mcp/server.ts
```

For Claude Desktop or any other MCP client, use the equivalent of:

```json
{
  "mcpServers": {
    "atomic-page-builder": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "cwd": "/absolute/path/to/Web-AtomicV3"
    }
  }
}
```

Run it standalone (it speaks JSON-RPC on stdin/stdout, so this is only useful for
checking that it boots):

```bash
npm run mcp
```

`DATABASE_URI` and `PAYLOAD_SECRET` are read from `.env`. Point `DATABASE_URI` at
a copy of the database if you want the AI to work somewhere disposable.

## Setup — HTTP (editing the live site)

**1. Set `MCP_SECRET` in the deployed environment.** The endpoint returns 503
until you do, so it is off by default. It must be at least 32 characters:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

In Coolify, add it alongside `PAYLOAD_SECRET` and redeploy.

**2. Point an MCP client at the endpoint.** For Claude Code, add it at *user*
scope (`~/.claude.json`) rather than the project's `.mcp.json`:

```json
{
  "mcpServers": {
    "atomic-live": {
      "type": "http",
      "url": "https://your-site.com/api/mcp",
      "headers": { "Authorization": "Bearer YOUR_MCP_SECRET" }
    }
  }
}
```

> **Do not put the token in the committed `.mcp.json`** — that file is in git.
> Keep it in user-scope config, or reference an environment variable with
> `"Bearer ${ATOMIC_MCP_SECRET}"` so the value itself stays out of the repo.

**3. Verify:**

```bash
curl -s -X POST https://your-site.com/api/mcp \
  -H "Authorization: Bearer YOUR_MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### What the endpoint grants

A valid token gives **full admin control** over pages, media and site settings —
the tools run with `overrideAccess: true` and are not tied to a Payload user.
Treat `MCP_SECRET` like `PAYLOAD_SECRET`. It is a single shared token with no
per-user attribution, no scoping and no rate limiting, so rotating it is the only
way to revoke access. Anything published through it goes live immediately.

The endpoint accepts POST only. It is stateless (no sessions), offers no SSE
stream, and sends no CORS headers — it is meant for server-side MCP clients, not
browsers.

## Tools

### Discovery

| Tool | Purpose |
| --- | --- |
| `get_builder_schema` | Section/row/column structure, row layouts and their column counts, theme, padding, alignment, background and CSS options |
| `list_blocks` | Every content block type with its editable fields; pass `type` for one block in full |

Both are derived from the live Payload config, so site-specific blocks added
through `createAtomicCMSPlugin({ additionalBlocks })` show up automatically and
the schemas cannot drift from the admin UI.

### Pages

| Tool | Purpose |
| --- | --- |
| `list_pages` | List pages with slug, title and status |
| `get_page` | Read a page as an indexed `outline`, as full `compact` content, or `raw` |
| `create_page` | Create a page from compact sections |
| `update_page` | Change title, slug, excerpt, SEO, publish status |
| `set_page_content` | Replace a page's entire content |
| `edit_page` | Apply targeted structural edits (see below) |
| `delete_page` | Delete a page permanently |

### Media and site-wide styling

| Tool | Purpose |
| --- | --- |
| `list_media` | Find media ids for image fields and section backgrounds |
| `upload_media` | Add an image or document from a local path or URL |
| `get_site_settings` | Branding, navigation, contact details, global CSS, analytics |
| `update_site_settings` | Update those, including `globalCustomCss` |

## The compact format

Payload stores the builder as deeply nested `sectionName` / `rowLayout` /
`column1..column4` / `contentBlocks` structures. The tools accept and return a
flatter shape instead, which is far easier for a model to author correctly:

```json
{
  "name": "Hero",
  "theme": "dark",
  "padding": "level5",
  "fullWidth": "yes",
  "verticalAlignment": "middle",
  "background": { "image": "<media id>", "size": "cover", "position": "center" },
  "css": { "class": "hero", "style": "min-height: 60vh;" },
  "rows": [
    {
      "name": "Hero row",
      "layout": "two-thirds-third",
      "columns": [
        { "name": "Copy", "blocks": [{ "type": "text", "content": "<h1>Hello</h1>" }] },
        { "blocks": [{ "type": "buttons", "buttons": [{ "label": "Contact", "url": "/contact", "style": "primary" }] }] }
      ]
    }
  ]
}
```

Notes:

- `columns` is a plain array; it maps onto `column1..column4`. Supplying more
  columns than the chosen `layout` allows is an error rather than silent data loss.
- `css` — `{ class, id, style, hide }` — is available on sections, rows, columns
  and blocks, and maps to the builder's `customCssClass` / `customCssId` /
  `customInlineStyle` / `hide` fields.
- `name` on a block is its internal `blockName` label.
- Reading a page back with `format: "compact"` returns the same shape, so
  read-modify-write round trips are lossless.

## Structural editing

`edit_page` takes an ordered list of operations, applied against current content
and saved as a single update. Batch related changes into one call.

```
addSection    { section, index? }              updateSection { section, patch }
deleteSection { section }                       moveSection   { section, to }
addRow        { section, row, index? }          updateRow     { section, row, patch }
deleteRow     { section, row }                  moveRow       { section, row, to }
updateColumn  { section, row, column, patch }
addBlock      { section, row, column, block, index? }
updateBlock   { section, row, column, block, patch }
deleteBlock   { section, row, column, block }
moveBlock     { section, row, column, block, to: { section?, row?, column?, index? } }
```

For `addSection` / `addRow` / `addBlock` the `section` / `row` / `block` value is
the **new object**; everywhere else it is a **zero-based index** taken from
`get_page`. `patch` merges into the existing object, and a `css` patch merges key
by key. Because each operation shifts later indices, delete in descending index
order.

## Publish behaviour

`status` is optional on every write. Omitted, a page keeps the status it already
had: editing a published page updates the live page, and editing a draft leaves it
a draft. Pass `status: "published"` to publish, `status: "draft"` to unpublish.
`create_page` defaults to `draft`.

Saving a published page runs the collection's `afterChange` hook, which
revalidates the affected routes — so live edits appear without a redeploy.

If you would rather the AI never touch the live site, point `DATABASE_URI` at a
copy of the database, or tell the assistant to pass `status: "draft"` on every
write and publish from the admin UI yourself.

## Validation

Content is validated before it reaches the database, and errors name the exact
path that failed so the model can correct itself without extra round trips:

```
sections[2].rows[0]: layout "half-half" has 2 column(s) but 3 were supplied.
sections[0].rows[0].columns[0].blocks[1]: unknown block type "nonsense". Available: text, image, …
sections[0].rows[0].columns[0].blocks[1]: block "text" has no field(s): contnet. Valid fields: …
section[9] does not exist (there are 2). Call get_page to see current indices.
```

## Files

| File | Role |
| --- | --- |
| `create-server.ts` | Builds the configured MCP server — shared by both transports |
| `server.ts` | stdio entrypoint |
| `http.ts` | Stateless HTTP transport used by the route handler |
| `tools.ts` | Tool definitions and handlers (transport-agnostic) |
| `compact.ts` | Compact ⇄ Payload conversion, validation, outline rendering |
| `schema.ts` | Introspects the live Payload config into AI-readable schemas |
| `../app/api/mcp/route.ts` | HTTP endpoint: auth, then delegates to `http.ts` |

`tools.ts` holds no transport details, and `create-server.ts` is the single place
the tools are registered, so the two transports cannot drift apart.

## Implementation note

stdout is the JSON-RPC channel, but Payload's logger writes there too. `server.ts`
hands the transport a writer bound to the real stdout and redirects all other
stdout writes to stderr, so log output cannot corrupt the protocol stream. Keep
that in place if you refactor the entrypoint, and avoid wrapping the server in
`npm run` for MCP clients — npm's own banner would land on stdout ahead of it.
