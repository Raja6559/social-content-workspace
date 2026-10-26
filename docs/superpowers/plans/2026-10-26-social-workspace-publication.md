# Social Content Workspace publication plan

> Execute inline with superpowers:executing-plans. Raja authorized Task 3 by requesting start after the local preview.

**Goal:** Publish the verified independent demo and add one checked AI platform concept to Work.
**Architecture:** Cloudflare static asset Worker for the demo; a small screenshot-led server-rendered Work feature links to it. No iframe, new enquiry schema, homepage change or internal-agent feature.
**Spec:** ../specs/2026-10-26-social-content-workspace-design.md
**Stack:** Existing React/Vite demo, Wrangler, GitHub, current TanStack website and Playwright.

## Constraints
- Demo repo social-content-workspace; Worker krelyvo-demo-social-workspace; hostname demo-social-workspace.krelyvo.com.
- Preserve fictional/demo labels, original media, five in-memory views, no external AI/account/publishing connections, and noindex header plus metadata.
- Keep main website indexable and preserve seven website concepts, three campaigns, anchors and four commercial services.
- Enquiry selects ai-agents-automation + custom-agents only. Never submit a real enquiry.
- Initial repository visibility matches the existing public portfolio demos. No credentials or environment files are committed.
- No forced push, squash, rebase or rewrite of published commits.

## Review focus
- A live link is added only after HTTPS, correct content and robot headers are confirmed.
- Image preview remains readable and reserved at responsive dimensions.
- Native Work anchor and feature remain usable without JavaScript and respect reduced motion.
- Website filters do not hide the new feature or creative campaigns.
- Local/public browser checks use their configured origin and never contact the enquiry API.

## 1. Publish the dedicated demo
Files: wrangler.jsonc, package.json/bun.lock, e2e/workspace.spec.ts, README.md, docs/publication.md.
- [ ] Configure a pinned Wrangler, dist static assets, dedicated custom domain and no workers.dev alias.
- [ ] Parameterize browser checks for the public origin; test locally, TypeScript/build, inspect dry run and commit.
- [ ] Create the dedicated public GitHub repository on main, push and deploy the named Worker.
- [ ] Verify HTTPS, HTML/header noindex, seven complete interaction checks, no unexpected app calls and read-only contact selection.
- [ ] Connect the repository for automatic builds where account permissions allow, with BUN_VERSION=1.4.2 and the static deployment command.

## 2. Add one Work feature
Files in main website: src/components/ai-platform-concept.tsx, src/routes/work.tsx, src/assets/social-workspace-{720,1440}.webp, e2e/ai-platform-concept.spec.ts.
- [ ] Browser test first: feature/labels, demo destination, enquiry URL, native anchor, no iframe/extra runtime load, preserved filters/campaigns.
- [ ] Capture fresh demo overview at 1440x900, create compressed responsive derivatives and document provenance.
- [ ] Add section #ai-platform-concepts after creative campaigns and before existing closing CTA.
- [ ] Copy: AI platform concepts. / Social Content Workspace. / Concept Project · Interactive demo.
- [ ] Explain brief → sample ideas → caption editing → human review → sample export, and explicitly no live AI/account connection/publishing.
- [ ] Safe new-tab Explore interactive demo link; Discuss a custom system reuses valid service/offering preselection.
- [ ] Add the Work collection anchor and update introduction/metadata only. No homepage or global-nav change.

## 3. Verify and release
- [ ] Run website unit suite, TypeScript, production build and full browser suite; visually inspect 320–1440px and no-JS/reduced-motion states.
- [ ] Fresh bounded review and fix material findings with regression verification.
- [ ] Push website feature branch, create/attach PR, merge normally and confirm Cloudflare build succeeds.
- [ ] Public verification of Work, demo and enquiry preselection; save release record and provide public links.
