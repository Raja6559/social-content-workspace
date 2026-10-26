import type { RefObject } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  Download,
  FileText,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Artwork, RealLinks, Status } from "./components";
import { getMetrics, type Draft, type Workspace } from "./workspace";
type Heading = { headingRef: RefObject<HTMLHeadingElement | null> };
function Heading({
  headingRef,
  title,
  description,
}: Heading & { title: string; description: string }) {
  return (
    <div className="page-heading">
      <h1 ref={headingRef} tabIndex={-1}>
        {title}
      </h1>
      <p>{description}</p>
    </div>
  );
}
export function Overview({
  state,
  headingRef,
}: { state: Workspace } & Heading) {
  const metrics = getMetrics(state);
  const next = state.drafts.find((d) => d.status === "needs-review");
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">The human part stays central</span>
        <Heading
          headingRef={headingRef}
          title="A clear path from brief to approval."
          description="Explore a fictional content workflow, with people in control of the final decision."
        />
      </div>
      <div className="metrics-header">
        <h2>At a glance</h2>
        <span className="sample-label">Sample campaign data</span>
      </div>
      <div className="metrics-grid">
        {(
          [
            {
              key: "campaigns",
              label: "Campaign",
              detail: "One fictional brand",
            },
            {
              key: "drafts",
              label: "Content drafts",
              detail: "Prepared sample content",
            },
            {
              key: "needsReview",
              label: "Needs review",
              detail: "Awaiting a demo decision",
            },
            {
              key: "approved",
              label: "Approved in demo",
              detail: "Ready for sample handoff",
            },
          ] as const
        ).map((m) => (
          <div className="metric" key={m.key}>
            <span>{m.label}</span>
            <strong
              data-testid={
                "metric-" + (m.key === "needsReview" ? "needs-review" : m.key)
              }
            >
              {metrics[m.key]}
            </strong>
            <small>{m.detail}</small>
          </div>
        ))}
      </div>
      <div className="overview-grid">
        <section className="campaign-panel">
          <div className="panel-topline">
            <span>Featured sample campaign</span>
            <span className="quiet-tag">Concept Project</span>
          </div>
          <div className="campaign-feature">
            <div className="campaign-copy">
              <span className="restaurant-wordmark">Ember &amp; Oak</span>
              <h2>
                An evening, <br />
                imagined.
              </h2>
              <p>
                Warm light. Seasonal plates. An invitation to stay a little
                longer.
              </p>
              <div className="channel-list">
                <span>
                  Instagram <small>Not connected</small>
                </span>
                <span>
                  Facebook <small>Not connected</small>
                </span>
              </div>
              <a href="#brief" className="button secondary">
                Explore the brief <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <Artwork draft={state.drafts[0]!} eager />
          </div>
        </section>
        <div className="overview-right">
          <section className="review-next panel">
            <div className="panel-topline">
              <h2>Next for review</h2>
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            {next ? (
              <>
                <Status draft={next} />
                <h3>{next.title}</h3>
                <p>{next.headline}</p>
                <a href={"#review/" + next.id} className="button primary">
                  Open review queue <ArrowRight size={16} aria-hidden="true" />
                </a>
              </>
            ) : (
              <>
                <h3>No drafts waiting.</h3>
                <p>Open Drafts to edit an item and send it for demo review.</p>
                <a href="#drafts" className="button secondary">
                  Open drafts <ArrowRight size={16} aria-hidden="true" />
                </a>
              </>
            )}
          </section>
          <section className="activity-panel panel">
            <div className="panel-topline">
              <h2>Activity in this visit</h2>
              <span className="quiet-tag">Demo only</span>
            </div>
            {state.activity.length ? (
              <ol>
                {state.activity.slice(0, 5).map((a) => (
                  <li key={a.id}>
                    <Check size={14} aria-hidden="true" />
                    <span>{a.message}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-activity">No actions in this visit yet</p>
            )}
          </section>
        </div>
      </div>
      <section className="workflow-strip" aria-label="Example content workflow">
        <div>
          <span>01</span>
          <strong>Brief</strong>
        </div>
        <ChevronRight aria-hidden="true" />
        <div>
          <span>02</span>
          <strong>Ideas</strong>
        </div>
        <ChevronRight aria-hidden="true" />
        <div>
          <span>03</span>
          <strong>Drafts</strong>
        </div>
        <ChevronRight aria-hidden="true" />
        <div>
          <span>04</span>
          <strong>Review</strong>
        </div>
        <ChevronRight aria-hidden="true" />
        <div>
          <span>05</span>
          <strong>Export</strong>
        </div>
      </section>
    </>
  );
}
export function Brief({ headingRef }: Heading) {
  return (
    <>
      <Heading
        headingRef={headingRef}
        title="Good content starts with context."
        description="The brief gives every draft a direction. This example is fixed, so prepared sample ideas stay honest about their source."
      />
      <div className="brief-grid">
        <section className="brand-panel panel">
          <span className="sample-label">Example brief</span>
          <div className="brand-monogram" aria-hidden="true">
            E&amp;O
          </div>
          <h2>Ember &amp; Oak</h2>
          <p>A fictional neighbourhood restaurant.</p>
          <dl>
            <div>
              <dt>Campaign</dt>
              <dd>An evening, imagined</dd>
            </div>
            <div>
              <dt>Brand voice</dt>
              <dd>Warm, considered, welcoming.</dd>
            </div>
            <div>
              <dt>Example channels</dt>
              <dd>
                Instagram &amp; Facebook
                <br />
                <span className="muted">Not connected</span>
              </dd>
            </div>
          </dl>
          <RealLinks />
        </section>
        <section className="brief-details panel">
          <h2>The direction</h2>
          <dl>
            <div>
              <dt>Goal</dt>
              <dd>
                Introduce the restaurant’s imagined atmosphere, seasonal menu
                and shared-table experience.
              </dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>
                People exploring neighbourhood dining and evenings with friends.
              </dd>
            </div>
            <div>
              <dt>Creative approach</dt>
              <dd>
                Warm dining imagery, food-led layouts and a shared-table story,
                carried across three sample posts.
              </dd>
            </div>
            <div>
              <dt>Guardrails</dt>
              <dd>
                No invented reviews, location, booking availability, performance
                results or real customer data.
              </dd>
            </div>
          </dl>
          <div className="review-note">
            <ShieldCheck size={18} aria-hidden="true" />
            <p>
              In a custom production system, an agreed brand profile and
              approved information would guide the work. This demo uses a
              read-only example.
            </p>
          </div>
          <a href="#ideas" className="button primary">
            Explore sample ideas <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
      </div>
    </>
  );
}
export function Ideas({ drafts, headingRef }: { drafts: Draft[] } & Heading) {
  return (
    <>
      <Heading
        headingRef={headingRef}
        title="A starting point for every post."
        description="Three directions for one fictional campaign. Open a sample draft to explore how ideas become content people can review."
      />
      <div className="notice-inline">
        <ShieldCheck size={17} aria-hidden="true" />
        <p>Prepared sample ideas — no AI request is made</p>
      </div>
      <div className="ideas-grid">
        {drafts.map((d, i) => (
          <article className="idea-card panel" key={d.id}>
            <div className="panel-topline">
              <span className="idea-number">0{i + 1}</span>
              <span className="quiet-tag">Sample idea</span>
            </div>
            <Artwork draft={d} />
            <h2>{d.title}</h2>
            <p>{d.purpose}</p>
            <span className="idea-format">Single-image social post · 4:5</span>
            <a
              href={"#drafts/" + d.id}
              className="button secondary"
              aria-label={"Open sample draft: " + d.title}
            >
              Open sample draft <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
export function DraftEditor({
  draft,
  drafts,
  headingRef,
  buffer,
  change,
  dirty,
  error,
  save,
  submit,
  download,
}: Heading & {
  draft: Draft;
  drafts: Draft[];
  buffer: string;
  change: (value: string) => void;
  dirty: boolean;
  error: string | null;
  save: () => void;
  submit: () => void;
  download: () => void;
}) {
  return (
    <>
      <Heading
        headingRef={headingRef}
        title={draft.title}
        description="Shape the caption, save your changes, then send the saved draft for demo review. Nothing is generated or published here."
      />
      <nav aria-label="Select a draft" className="draft-selector">
        {drafts.map((d) => (
          <a
            href={"#drafts/" + d.id}
            key={d.id}
            aria-current={d.id === draft.id ? "page" : undefined}
          >
            {d.title}
          </a>
        ))}
      </nav>
      <div className="editor-grid">
        <Artwork draft={draft} large eager />
        <section className="editor-panel panel">
          <div className="panel-topline">
            <span className="sample-label">Example draft</span>
            <Status draft={draft} testId="draft-status" />
          </div>
          <h2>{draft.headline}</h2>
          <p className="muted">Instagram &amp; Facebook · Not connected</p>
          {draft.note && (
            <div className="review-note">
              <MessageSquare size={17} aria-hidden="true" />
              <p>{draft.note}</p>
            </div>
          )}
          <label className="field-label" htmlFor="caption">
            Caption
          </label>
          <textarea
            id="caption"
            rows={8}
            value={buffer}
            onChange={(e) => change(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "caption-error" : "caption-count"}
            spellCheck="true"
          />
          <div className="editor-meta">
            <span>{dirty ? "Unsaved demo edits" : "Saved sample content"}</span>
            <span id="caption-count">
              {buffer.length.toLocaleString()} / 2,000
            </span>
          </div>
          {error && (
            <p id="caption-error" className="error" role="alert">
              {error}
            </p>
          )}
          <div className="editor-actions">
            <button type="button" className="button primary" onClick={save}>
              <Check size={16} aria-hidden="true" />
              Save demo changes
            </button>
            {(draft.status === "draft" ||
              draft.status === "changes-requested") && (
              <button
                type="button"
                className="button secondary"
                onClick={submit}
              >
                <Send size={16} aria-hidden="true" />
                Send for demo review
              </button>
            )}
            {draft.status === "needs-review" && !dirty && (
              <a href={"#review/" + draft.id} className="button secondary">
                Open in review <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
            {draft.status === "approved" && !dirty && (
              <button
                type="button"
                className="button secondary"
                onClick={download}
              >
                <Download size={16} aria-hidden="true" />
                Download sample handoff
              </button>
            )}
          </div>
          <p className="footnote">
            Saving an edited caption clears its previous approval. Edits stay in
            this page session only.
          </p>
        </section>
      </div>
    </>
  );
}
export function Review({
  draft,
  drafts,
  headingRef,
  approve,
  requestChanges,
  download,
}: Heading & {
  draft: Draft;
  drafts: Draft[];
  approve: () => void;
  requestChanges: () => void;
  download: () => void;
}) {
  const groups = [
    { name: "Needs review", status: "needs-review" },
    { name: "Changes requested", status: "changes-requested" },
    { name: "Approved in demo", status: "approved" },
  ] as const;
  return (
    <>
      <Heading
        headingRef={headingRef}
        title="A person makes the final call."
        description="Read the saved caption, check the creative and decide what happens next. All decisions apply to this demo only."
      />
      <div className="review-layout">
        <section className="review-list panel" aria-label="Review queue">
          {groups.map((group) => (
            <div className="queue-group" key={group.status}>
              <h2>
                {group.name}
                <span>
                  {drafts.filter((d) => d.status === group.status).length}
                </span>
              </h2>
              {drafts
                .filter((d) => d.status === group.status)
                .map((d) => (
                  <a
                    href={"#review/" + d.id}
                    key={d.id}
                    className={
                      "queue-item " + (d.id === draft.id ? "selected" : "")
                    }
                    aria-label={"Review " + d.title}
                    aria-current={d.id === draft.id ? "page" : undefined}
                  >
                    <FileText size={16} aria-hidden="true" />
                    <span>
                      {d.title}
                      <small>Ember &amp; Oak</small>
                    </span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </a>
                ))}
              {!drafts.some((d) => d.status === group.status) && (
                <p className="queue-empty">No drafts in this stage.</p>
              )}
            </div>
          ))}
          {drafts.filter((d) => d.status === "draft").length > 0 && (
            <p className="queue-empty">
              Edited drafts are in <a href="#drafts">Drafts</a> until you send
              them for review.
            </p>
          )}
        </section>
        <section className="review-detail panel" aria-label="Selected review">
          <div className="panel-topline">
            <h2>{draft.title}</h2>
            <Status draft={draft} testId="review-status" />
          </div>
          <div className="review-content">
            <Artwork draft={draft} eager />
            <div className="review-caption">
              <span className="field-label">Saved caption</span>
              <p className="caption-text">{draft.caption}</p>
              {draft.note && (
                <div className="review-note">
                  <MessageSquare size={17} aria-hidden="true" />
                  <p>{draft.note}</p>
                </div>
              )}
              <p className="muted">Instagram &amp; Facebook · Not connected</p>
              <div className="review-actions">
                {draft.status === "needs-review" && (
                  <>
                    <button
                      type="button"
                      className="button primary"
                      onClick={approve}
                    >
                      <CheckCheck size={16} aria-hidden="true" />
                      Approve in demo
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={requestChanges}
                    >
                      Request changes
                    </button>
                  </>
                )}
                {draft.status === "changes-requested" && (
                  <a className="button primary" href={"#drafts/" + draft.id}>
                    Edit sample draft{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
                {draft.status === "draft" && (
                  <a className="button primary" href={"#drafts/" + draft.id}>
                    Continue editing <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
                {draft.status === "approved" && (
                  <button
                    type="button"
                    className="button primary"
                    onClick={download}
                  >
                    <Download size={16} aria-hidden="true" />
                    Download sample handoff
                  </button>
                )}
              </div>
              <p className="footnote">
                This is a local demonstration of human review. No notification,
                social post or live approval is sent.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
