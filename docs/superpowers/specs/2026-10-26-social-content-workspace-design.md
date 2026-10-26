# Social Content Workspace — Concept Design

Date: 2026-10-26
Task 1: concept and screen specification
Status: Approved when Raja requested Task 2 on 2026-10-26. Local build and verification complete. Publishing remains Task 3.

## Intent

Create Krelyvo's first interactive AI-platform portfolio concept. Help prospective clients understand how a scoped social-content system could turn a brand brief into ideas, editable drafts and human-reviewed exports. Demonstrate interface and workflow design, not existing AI capabilities or customer outcomes.

Name: **Social Content Workspace**.
Credit: **A platform concept by Krelyvo Studio**.
Do not name it Krelyvo Agent Studio: that is the separate private internal product. Do not place this concept on `/ai-agents`, which remains Krelyvo's own-agent showcase.

## Approaches and recommended scope

The accepted direction is an interactive portfolio showcase. For the specification, recommend a focused walkthrough with working local interactions and predefined fictional content. A static screen gallery is cheaper but cannot explain review and state changes as clearly. A production AI application adds authentication, storage, API cost and integration work outside this showcase's purpose.

The focused walkthrough is the proposed implementation approach. Task 2 approval adopts this specification; Task 1 creates documentation only.

## Boundaries and project location

Proposed independent demo folder:
`D:\Raja\Business Work\Krelyvo Studio\portfolio-demos\social-content-workspace`

Keep its future Git repository, build and deployment separate from the website and private Agent Studio. Follow the existing demos' React, TypeScript, Tailwind and Cloudflare approach. Inspect a current demo's build configuration before scaffolding. Keep the implementation small; no authentication, database, backend endpoint, API key or new animation dependency is required.

Do not create that folder, repository or hosting configuration during Task 1. Task 2 builds and verifies locally; Task 3 publishes and integrates a checked demo link on Work. A provisional hostname is `demo-social-workspace.krelyvo.com`; it is a proposal, not a provisioned address.

## Narrative and sample campaign

Use one fictional Ember & Oak campaign, **An evening, imagined**. Reuse the three approved restaurant campaign post images rather than generate another set. Keep the restaurant's warm imagery inside the studio's navy interface.

Fixed sample brief:
- Brand: Ember & Oak — fictional restaurant concept.
- Goal: introduce the restaurant's imagined atmosphere, seasonal menu and shared-table experience.
- Audience: people exploring neighbourhood dining and evenings with friends.
- Voice: warm, considered, welcoming; no sales pressure or unsupported claims.
- Channels: Instagram and Facebook, shown as example destinations with **Not connected** labels.
- Guardrails: no invented reviews, location, booking availability, performance results or real customer data.

Three sample ideas: Atmosphere, Menu direction and Gathering. Three matching sample drafts start as:
- Atmosphere: **Needs review**.
- Menu direction: **Changes requested** with the preset note “Keep the menu description clearly illustrative.”
- Gathering: **Approved in demo**.

Use existing captions from `src/data/ember-campaign-media.ts` as the initial text, preserving their concept language. Existing restaurant creative files remain unmodified.

## Visual direction

Use the finalized colorful K logo, deep navy #121221, electric blue #2D6BFF, restrained purple #7A3DFF, Sora headings and Inter body copy. Reuse a licensed existing logo/font asset and preserve notices when copying to the independent demo. Do not introduce a new identity.

Desktop: compact left navigation, a clear top bar and generous main content. Use five destinations: Overview, Brand & Brief, Ideas, Drafts, Review. Avoid filling the screen with disconnected statistics. Give the current task and review item visual priority.

A small process line communicates **Brief → Ideas → Drafts → Review → Export**. It reflects actual demo state and navigation, not a fictional live agent execution. On phones replace the sidebar with a labelled, wrapping or horizontally scrollable navigation; no squeezed desktop dashboard or essential horizontal page scrolling.

Use CSS for short transitions, focus/hover feedback and a one-time entrance where useful. No orbiting AI core, background video, voice control, CPU/memory gauges, connected-model badges, analytics charts or perpetual motion. Respect reduced motion and keep essential content visible if animation fails.

## Five screens and real demo interactions

### 1. Overview

Heading: **A clear path from brief to approval.**
Supporting copy: **Explore a fictional content workflow, with people in control of the final decision.**

Show one campaign summary, the next review item and a concise recent-demo-activity list. Counts are derived from the in-memory records, never separately hardcoded: campaign count, draft count, needs-review count and approved count. Place **Sample campaign data** beside the metrics. Initially these are 1 campaign, 3 drafts, 1 needing review and 1 approved. Changes requested is a separate status, not counted as Needs review.

Activity initially says **No actions in this visit yet**. Record only actual actions taken in this browser visit, such as caption saved, submitted for review, changes requested, approved and reset. Do not seed a fabricated live feed or invented staff identity. Primary action **Open review queue**.

### 2. Brand & Brief

Show the fixed example brand profile and campaign brief above. This release is read-only; explicitly label it **Example brief**. This avoids implying suggestions are generated from edits. Include a link to Ideas and a short statement that a custom production system would use an agreed brand profile and approved information.

### 3. Ideas

Show all three predefined idea cards from first render. Label **Prepared sample ideas — no AI request is made**. Each includes its purpose, proposed format and **Open sample draft** action. That action opens the existing matching draft; it does not create duplicate drafts or increase the draft count.

Do not use a Generate button, fake typing delay, model picker or fabricated generation/cost log. These three samples are independent of visitor actions, not newly generated recommendations.

### 4. Drafts

List the three drafts with clear statuses. Opening a draft shows its matching complete post artwork, an editable caption, a character count and explicit **Save demo changes**. Use ordinary text areas and render input as text, never HTML. Limit caption length to 2,000 characters and reject empty or whitespace-only saved captions. Show an inline error with a clear correction path.

Unsaved edits live in a temporary editor buffer. On changing drafts or leaving Drafts with unsaved edits, ask **Discard unsaved changes?** with Keep editing/Discard choices; never silently save. Saves update in-memory content and activity. Saving a changed caption always moves that draft to **Draft**, clearing its prior approval or review note; saving identical content is a no-op. Artwork and the fixed brand brief are not editable.

**Send for demo review** is available only for a saved draft in Draft or Changes requested status. If there are unsaved edits, require Save or Discard first. It changes the status to Needs review. There is no real notification or other reviewer account.

### 5. Review and export

Show Needs review and Changes requested records, with separate statuses; keep approved work accessible in an Approved section. Open the saved caption/artwork in a review panel. **Approve in demo** and **Request changes** operate only on Needs review. Request changes requires a non-empty note, maximum 500 characters, returning the item to Changes requested. Approved items display **Approved in demo** consistently.

Only approved drafts expose **Download sample handoff**. This makes a working browser-generated `.txt` file for that selected draft, containing the concept/demo notice, brand, title, saved caption and current demo approval label. No original media, personal information or network call is included. This is an illustrative content handoff, not a publishing integration. Revoke temporary object URLs after download and sanitize the filename.

Exports do not change approval status, claim delivery, or add a fake publish event. Record an actual local download action in demo activity. Editing an approved draft removes its export eligibility until reviewed again. No scheduling, posting, messages or external uploads take place.

## State, reset and disclosure

Use a typed in-memory state model with stable sample IDs and one reducer or equivalent explicit state transitions. All screens use the same records. Never import, call or copy private Agent Studio code, environment configuration or database schema.

Persist nothing in cookies, localStorage, IndexedDB or a server. Edits and approvals last only for the open page session; reload restores the original sample. Hash/view changes within the page retain state. Explain **Demo changes reset when you reload** next to Reset demo.

Reset demo opens an accessible confirmation explaining that changes and activity will be discarded; cancellation preserves them. Confirmation restores the exact seed data, closes transient panels, clears editor buffers/notes/activity and returns to Overview. Use no fabricated timestamped history after resetting.

Always-visible banner:
**Interactive concept by Krelyvo Studio. Fictional sample data; no live AI, account connection or publishing. Changes reset on reload.**

Artwork disclosure:
**AI-generated concept imagery from the fictional Ember & Oak campaign.**

Use **Demo** or **Sample** on relevant approval and data labels, including downloaded files. Real visitor interactions must not make the copy claim that Krelyvo's internal agents are live.

## Navigation, access and links

No sign-in or forms collecting personal data. Navigation uses semantic links with stable hashes or accessible view controls; apply correct current-state semantics. Preserve useful Back behavior, focus visibility and a clear heading for each view. Dialogs trap focus, close with Escape and return focus to their trigger. Status changes use a concise polite live region.

With JavaScript unavailable show a meaningful concept introduction and sample workflow, and say interactive controls require JavaScript. Do not expose controls that pretend to work. Keep the concept notice and real links usable.

Real external links:
- **View the Ember & Oak campaign** → `https://krelyvo.com/work/ember-oak#campaign`.
- **Back to Krelyvo Work** → `https://krelyvo.com/work`.
- **Discuss a custom system** → `https://krelyvo.com/contact?service=ai-agents-automation&offering=custom-agents`.

Use a plain same-tab link for these intentional exits. Existing service/offering values are already validated by the website. Do not add a sample campaign ID, package or selected website concept to the enquiry URL. Do not send an enquiry during testing.

## Assets and performance

Three approved post sources, each with 432/864 WebP variants:
- `src/assets/ember-campaign/post-01-atmosphere-{432,864}.webp`.
- `src/assets/ember-campaign/post-02-menu-{432,864}.webp`.
- `src/assets/ember-campaign/post-03-gathering-{432,864}.webp`.

Copy derivatives into the independent demo at implementation time with an asset-source manifest and hashes; leave main-repo originals and production media modules unchanged. Reuse existing alt descriptions and show full 4:5 artwork without cutting embedded text. Reserve image dimensions, load responsive sizes and lazy-load noncritical images. No reel, third-party embed or new image generation is needed.

Initial demo HTML includes noindex/nofollow/noarchive metadata. Apply a matching X-Robots-Tag to demo responses during publishing. Noindex is a search preference, not private access. The demo contains public-safe fictional content only. Main Work stays indexable.

## Acceptance checks for Task 2

- Counts match one shared fixture and every real demo state change; no fake KPI, AI/API call or connected account.
- Open idea actions select existing drafts without duplication.
- Save validation, no-op saves, unsaved-navigation confirmation and approval invalidation work.
- Review transitions and required change notes work; only approved saved content can be exported.
- Download contains current saved text and concept labels, and no unintended markup, URL request or original media.
- Reset cancel preserves state; confirm/reload restore seeds and clear ephemeral data. No browser storage or cookie writes.
- All views, selectors, dialogs, errors and action results are operable by keyboard, with sensible focus and announcements.
- Check 320, 390, 430, 768 and 1440px: no page overflow, complete art, readable content and reachable controls. Respect reduced motion and provide a meaningful no-JavaScript fallback.
- Verify all three real Krelyvo links; enquiry link preselects AI Agents & Automation and Custom Agents without submitting.
- Run meaningful state-transition and download-format tests, TypeScript and production build. Review screenshots and network behavior locally. No public release in Task 2.

## Task 3 publication boundary

After local review, create/connect the dedicated repository and Cloudflare Worker, provision the confirmed demo hostname, verify HTTPS/noindex and add one **AI platform concepts** feature to Work linking to the checked demo. Keep existing website filters and seven cards, three campaigns, anchors and case studies. Update Work copy/metadata and collection navigation only as needed. No homepage preview, global-nav redesign or change to `/ai-agents`.

Task 3 must verify the public interaction flow and actual enquiry preselection, and confirm no unwanted external calls. No customer accounts or AI API funding required.

## Next bounded task

**Task 2 — Build and locally verify Social Content Workspace. Recommended model: Sol · High.**

This brief is the reviewable output of Task 1. Starting Task 2 authorizes implementation of this proposed design. Task 1 changes no application code, deployment or public content.

## Task 1 verification

Verified all six existing Ember post derivatives and the current contact-search support for service=ai-agents-automation and offering=custom-agents. Fresh read-only builder review: nothing important left. No application code changed; application tests and builds are reserved for Task 2.
