# Social Content Workspace

An independent fictional AI-platform portfolio concept by Krelyvo Studio. This is separate from the private Krelyvo Agent Studio.

## Local preview

Run in PowerShell:

```powershell
Set-Location -LiteralPath 'D:\Raja\Business Work\Krelyvo Studio\portfolio-demos\social-content-workspace'
bun install --frozen-lockfile
bun run build
bun run preview
```

Open http://127.0.0.1:8101. For development use `bun run dev`. The built preview avoids Windows file-watcher contention while copying assets.

## Scope

Five views: Overview, Brand & Brief, Ideas, Drafts and Review. Three prepared Ember & Oak samples share typed in-memory records. Counts reflect these records. Caption changes clear approval; sample review is explicit; approved saved text can be downloaded locally.

No backend, credentials, database, browser storage, AI requests, live social connection or publishing. All changes disappear on reload/reset. The sample handoff is plain text, not a social post or client approval. No analytics or external fonts.

## Checks

```powershell
bun run test
bun run typecheck
bun run build
bun run e2e
```

Run the built preview before the browser checks. Playwright uses the installed Chrome browser. Tests exercise seeded counts, validation, immutable review transitions, approval invalidation, browser Back/unsaved edits, local exports, reset/reload, keyboard/focus, reduced motion, no-JavaScript fallback and five responsive widths.

## Assets and licensing

Approved WebP derivatives come from Krelyvo's existing fictional Ember & Oak campaign. Sources, sizes and SHA-256 values are recorded in `docs/asset-manifest.json`. The lightweight K mark is the existing website brandmark, not a redesign. Original website assets remain unchanged.

Sora and Inter are installed via Fontsource, bundled locally, and their original SIL Open Font License notices are included under `public/licenses/`. No new imagery is generated in this milestone.

## Build and publishing

This local demo builds to `dist/` using Vite, React, TypeScript and Tailwind. Unlike the other TanStack demos, it needs no server runtime: the views use hashes and all state is local. The dedicated Cloudflare Worker serves the static assets. Do not reuse a TanStack `.output/server` deploy command for this demo.

Published demo: https://demo-social-workspace.krelyvo.com/. Source: https://github.com/Raja6559/social-content-workspace. The public demo passed seven browser checks plus HTTPS, noindex metadata/header and unknown-path checks. Automatic Git deployment requires the dashboard connection documented in docs/publication.md; this has not yet been verified. Noindex is a search preference, not private access.

The private Agent Studio and existing demo repositories are unchanged. Work integration is a separate website commit; see the publication verification record.
