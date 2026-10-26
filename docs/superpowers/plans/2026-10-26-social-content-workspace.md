# Social Content Workspace Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation. The approved Task 2 request authorizes the local build; no further execution-method gate is needed.

**Goal:** Build the approved independent, fictional content workflow demo and verify it locally.
**Architecture:** A static Vite React app, a typed pure reducer and in-memory editor buffers. Native hash links preserve history; Radix provides accessible dialogs. Local font packages and six existing WebPs prevent remote requests.
**Tech Stack:** React, TypeScript, Tailwind, Vite, Radix Dialog, Lucide, Bun tests and Playwright.
**Spec:** ../specs/2026-10-26-social-content-workspace-design.md

## Global constraints
- Task 2 does not publish, create a remote repository or modify the main website/Agent Studio.
- Use the approved five screens, fixed Ember brief and three sample drafts.
- No storage, credentials, backend, AI calls, account connection or real publishing.
- Every approval and download is labelled as a demo. Captions max 2,000 characters, change notes max 500.
- Keep complete 4:5 artwork, local fonts and clear no-JavaScript/reduced-motion behavior.

## Review focus
- Invalid or stale review actions cannot approve edited content.
- Whitespace-only and oversized captions/notes receive useful errors.
- Unsaved content survives canceled draft/view navigation and browser Back.
- Reset clears all transient editor/modal/activity state; reload restores seed.
- Unicode/markup-like input is treated as text and downloads stay local.

## Task 1: state and export contract
Files: src/workspace.ts, tests/workspace.test.ts.
Interfaces: createWorkspace(), workspaceReducer(state, action), getMetrics(state), validateCaption(text), validateNote(text), makeHandoff(draft).
- [x] Write and run failing state tests.
- [x] Implement seed data, validation, transitions, measured counts and approved-only text handoff.
- [x] Run Bun tests; include the state implementation in the local demo commit.

## Task 2: accessible interactive UI
Files: src/App.tsx, src/components.tsx, src/views.tsx, src/styles.css, src/main.tsx, index.html, public/assets/, docs/asset-manifest.json, e2e/workspace.spec.ts.
Consumes state interfaces from Task 1.
- [x] Write browser acceptance tests and observe the missing app fail.
- [x] Build five views, guarded navigation, focus-managed dialogs, review/export and reset using shared state.
- [x] Copy and hash approved media and logo; use installed local font assets.
- [x] Verify desktop/mobile, keyboard, invalid inputs, download content, no storage/network writes and reduced-motion/no-JS fallback.
- [x] Review screenshots, fix observed defects, run unit/browser/TypeScript/build checks and commit.

## Task 3: local handoff
Files: README.md, docs/verification.json, test-results/ screenshots (ignored).
- [x] Fresh whole-project review, fix material findings with regression checks.
- [x] Save verification results and start built preview at http://127.0.0.1:8101.
- [x] Confirm clean Git state and provide the preview plus next task/model recommendation. Do not publish.

## Implementation decisions
- A static Vite build replaces the other demos' server-rendered TanStack/Nitro pipeline: this demo has one page with hash views and no server features. It keeps React/TypeScript/Tailwind/Cloudflare compatibility while removing unused server dependencies.
- The initial HTML supplies a meaningful no-JavaScript explanation. Task 3 will configure deployment headers; Task 2 includes noindex metadata and a static _headers file.
