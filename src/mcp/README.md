# Page Builder MCP Server

An MCP server that lets an AI assistant build, edit, structure and style pages
through the Atomic content builder.

It talks to Payload over the **Local API**, so it operates directly on whatever
database `DATABASE_URI` points at — no HTTP layer, no API keys, and no need for
`next dev` to be running.

## Setup

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
| `server.ts` | stdio entrypoint and JSON-RPC wiring |
| `tools.ts` | Tool definitions and handlers (transport-agnostic) |
| `compact.ts` | Compact ⇄ Payload conversion, validation, outline rendering |
| `schema.ts` | Introspects the live Payload config into AI-readable schemas |

`tools.ts` deliberately holds no transport details, so the same tool set can be
exposed over HTTP later by wiring `toolMap` into a route handler.

## Implementation note

stdout is the JSON-RPC channel, but Payload's logger writes there too. `server.ts`
hands the transport a writer bound to the real stdout and redirects all other
stdout writes to stderr, so log output cannot corrupt the protocol stream. Keep
that in place if you refactor the entrypoint, and avoid wrapping the server in
`npm run` for MCP clients — npm's own banner would land on stdout ahead of it.
