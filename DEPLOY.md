# Deploying a new project with AtomicCMS

This repo is a complete, standalone Payload CMS + Next.js site. There's no
package to install and no separate "template" repo — a new site is just a
copy of this repo, pushed to its own git remote and deployed independently.
This doc walks through creating a new site and deploying it.

## 1. Prerequisites

- Node.js >= 20.9
- A place to deploy to — this repo is built around
  [Coolify](https://coolify.io) pulling a pre-built image (see §4), but any
  host that can run a Docker image works
- An SMTP2GO API key (email is required — used for form notifications, admin
  password resets, etc.)
- Optional: Cloudflare Turnstile keys (spam protection on forms), Cloudflare
  R2 or S3-compatible storage (media uploads + backups)

## 2. Bootstrap a new site

```powershell
.\scripts\new-site.ps1 -Name "client-name"
```

This exports this repo's tracked files (`git archive HEAD`) to
`../client-name/`, drops files that are specific to this reference repo
(`CHANGELOG.md`, `package-lock.json`), and replaces the `atomic-cms` /
`Atomic CMS` placeholders (package name, docker-compose container name, DB
filename, SMTP sender name, etc.) with your site's name.

**Commit any changes you want carried over before running this** — it
exports `git HEAD`, not your uncommitted working tree.

Then:

```bash
cd ../client-name
git init && git add -A && git commit -m "Initial commit"
```

Push that to its own new GitHub repo — that's what `build-and-push.yml`
(copied along with everything else) deploys from.

## 3. Local development

```bash
npm install --legacy-peer-deps
```

(`--legacy-peer-deps` is required — `@tinymce/tinymce-react` still declares a
React 18 peer range even though this stack runs React 19.)

```bash
cp .env.example .env
```

Fill in `.env` (see the full variable reference below), then:

```bash
npm run generate:types
npm run generate:importmap
npm run dev
```

Visit `http://localhost:3000/admin` — since no users exist yet, Payload shows
a "create your first admin user" screen. Once created, you're in.

## 4. Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | yes | `development` locally, `production` in Docker |
| `NEXT_PUBLIC_SITE_URL` | yes | Public URL of the site. Also needed as a GitHub Actions secret (see §5) — it's inlined into the client bundle at build time |
| `DATABASE_URI` | yes | `file:./data/<name>.db` for SQLite (default), or `postgres://user:pass@host:5432/db` for Postgres. See §6 — Postgres backups aren't supported yet |
| `PAYLOAD_SECRET` | yes | Long random string — used to sign sessions/tokens. Generate with e.g. `openssl rand -base64 32` |
| `CRON_SECRET` | yes | Random string protecting internal cron-triggered endpoints |
| `SMTP_API_KEY` / `SMTP_FROM` / `SMTP_FROM_NAME` | yes | SMTP2GO credentials for outgoing email |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | no | Leave blank to disable Cloudflare Turnstile on forms |
| `MCP_SECRET` | no | Bearer token for the AI page-builder endpoint at `/api/mcp`. **Grants full admin control over pages, media and site settings** — leave blank to keep the endpoint disabled (returns 503). Must be ≥32 chars; generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. See `src/mcp/README.md` |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_BUCKET` / `S3_ENDPOINT` / `S3_REGION` / `S3_PUBLIC_URL` | no | Leave blank to store media on local disk instead of R2/S3 |

R2 backup credentials (endpoint, access key, secret, bucket, retention counts)
are **not** environment variables — they're configured per-site in the admin
under **Backup Settings**.

## 5. Build (GitHub Actions) and deploy (Coolify)

The Coolify VPS only has 2GB of RAM — not enough to reliably run `next build`
on top of a live site. So the image is built in GitHub Actions and pushed to
GHCR; Coolify only ever **pulls** a finished image and runs it.

### One-time setup

1. In the new site's GitHub repo, set two Actions secrets (**Settings →
   Secrets and variables → Actions**): `NEXT_PUBLIC_SITE_URL` and
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (leave the latter empty if unused).
2. Push to `main`/`master` (or run manually via **Actions → Run workflow**)
   to trigger [`build-and-push.yml`](.github/workflows/build-and-push.yml).
   It builds the Dockerfile (which also runs migrations against a throwaway
   local DB during the build — see §6) and pushes
   `ghcr.io/<org>/<repo>:latest` (and `:<commit-sha>`).
3. **Make the GHCR package pullable by Coolify.** By default a package
   pushed with the workflow's own `GITHUB_TOKEN` is private and tied to the
   repo. Either make the package public (package settings on GitHub →
   Change visibility), or give Coolify a PAT with `read:packages` scope.
4. In Coolify, create a new **Application** using the **Docker Image**
   source (not "Docker Compose build" / not "Dockerfile") pointed at
   `ghcr.io/<org>/<repo>:latest`. If the package is private, add the PAT
   from the previous step as Coolify's registry credential.
5. Set the runtime environment variables from the §4 table
   (`PAYLOAD_SECRET`, `DATABASE_URI`, `CRON_SECRET`, `SMTP_*`, etc.) directly
   in Coolify.
6. Add the two persistent volumes (matching what the image expects):
   - `/app/data` (the SQLite file, if using SQLite)
   - `/app/public/media` (uploaded media, if not using S3/R2)
7. Deploy. The container's `CMD` runs migrations again before starting the
   server (`yes | npm run migrate && node server.js`) — this is what applies
   schema to the real persistent volume; the migration during the build (step
   2) only ever touches a throwaway file inside the image.
8. Health checks hit `/api/health` — confirm it returns 200 once the
   container is up.
9. Visit `https://your-domain/admin` and create the first admin user.

To redeploy after further commits: re-run `build-and-push.yml` (push to
`main`/`master`, or trigger it manually), then tell Coolify to pull and
restart (either its own redeploy button, or a configured webhook — Coolify
doesn't rebuild from source in this setup, it just re-pulls the image tag).

`docker-compose.yml` is **local-dev only** — it still has a `build:` block so
`docker compose up` works on your machine, but Coolify doesn't read it.

## 6. Schema changes / migrations

This repo ships with a real initial migration (`src/migrations/` for SQLite,
`src/migrations-postgres/` for Postgres) — both are just the plain Payload
CLI:

```bash
npm run payload migrate:create <name>   # after changing a collection/field
npm run migrate                          # apply pending migrations
```

If you add or change a collection/field, generate a new migration and commit
it — the Dockerfile's `builder` stage runs `npm run migrate && npm run build`
so the home page and sitemap (which prerender at build time) always have
real schema to query. Skipping this after a schema change will make the
Docker build fail loudly (better than a silent runtime failure) with an
"no such table"/"no such column" error.

## 7. Optional: Postgres instead of SQLite

Default is SQLite (zero extra services). To use Postgres instead:

1. For local dev, uncomment the `postgres` service block in
   `docker-compose.yml`. For a real deployment, provision Postgres
   separately (e.g. a Coolify-managed database resource) — Coolify doesn't
   read `docker-compose.yml` (§5), so its `postgres` block is dev-only.
2. Set `DATABASE_URI` to a `postgres://...` connection string instead of a
   `file:...` path — the CMS picks the right database adapter and migration
   directory automatically based on the URL scheme.
3. Known gap: the backup system only supports SQLite right now. A Postgres
   deployment will get a clear error if a backup is triggered, rather than
   silently failing — full Postgres backup support is a separate follow-up.

## 8. Troubleshooting

- **`npm install` fails with a peer dependency error** — add
  `--legacy-peer-deps` (see §3).
- **Container healthcheck failing** — check `/api/health` directly; usually
  means the app crashed on boot (bad `DATABASE_URI`, missing `PAYLOAD_SECRET`).
- **Docker build fails with "no such table"** — a migration is missing for a
  recent schema change; see §6.
- **Coolify can't pull the image / 401 from GHCR** — the package is private
  and Coolify doesn't have a registry credential for it (see §5 step 3):
  either make the GHCR package public or add a PAT with `read:packages` to
  Coolify.
- **Redeployed but nothing changed** — you triggered Coolify's redeploy
  without first re-running `build-and-push.yml`, so it just pulled the same
  image again (see §5).
