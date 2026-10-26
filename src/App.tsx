import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCheck,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  createWorkspace,
  workspaceReducer,
  conceptNotice,
  views,
  validateCaption,
  validateNote,
  makeHandoff,
  type ViewId,
  type DraftId,
  type Draft,
} from "./workspace";
import { Modal } from "./components";
import { Overview, Brief, Ideas, DraftEditor, Review } from "./views";

type Route = { view: ViewId; id: DraftId };
type Pending = { hash: string; index?: number } | { external: string };
function readRoute(hash: string): Route {
  const [v, d] = hash.replace(/^#/, "").split("/");
  return {
    view: views.some((i) => i.id === v) ? (v as ViewId) : "overview",
    id: d === "menu" || d === "gathering" ? d : "atmosphere",
  };
}
const navIcons = {
  overview: LayoutDashboard,
  brief: ClipboardList,
  ideas: Lightbulb,
  drafts: FileText,
  review: CheckCheck,
};

export function App() {
  const [state, dispatch] = useReducer(
    workspaceReducer,
    undefined,
    createWorkspace,
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const [route, setRoute] = useState<Route>(() => readRoute(location.hash));
  const routeRef = useRef(route);
  routeRef.current = route;
  const selected = state.drafts.find((d) => d.id === route.id)!;
  const [buffer, setBuffer] = useState(selected.caption);
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [modal, setModal] = useState<"discard" | "reset" | "changes" | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const noteDraft = useRef<DraftId | null>(null);
  const pending = useRef<Pending | null>(null);
  const modalTrigger = useRef<HTMLElement | null>(null);
  const focusMainAfterDialog = useRef(false);
  const dirty = route.view === "drafts" && buffer !== selected.caption;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const index = useRef(0);
  const restoring = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  function adopt(hash: string) {
    noteDraft.current = null;
    if (modal) {
      focusMainAfterDialog.current = true;
      setModal(null);
      pending.current = null;
    }
    const next = readRoute(hash);
    routeRef.current = next;
    setRoute(next);
    setBuffer(stateRef.current.drafts.find((d) => d.id === next.id)!.caption);
    setCaptionError(null);
    setNote("");
    setNoteError(null);
  }
  const adoptRef = useRef(adopt);
  adoptRef.current = adopt;
  useEffect(() => {
    history.replaceState({ demoIndex: 0 }, "", location.hash || "#overview");
    const pop = (event: PopStateEvent) => {
      if (restoring.current) {
        restoring.current = false;
        return;
      }
      const nextIndex =
        typeof event.state?.demoIndex === "number"
          ? event.state.demoIndex
          : index.current + 1;
      if (dirtyRef.current) {
        pending.current = { hash: location.hash, index: nextIndex };
        modalTrigger.current = document.activeElement as HTMLElement;
        setModal("discard");
        if (
          nextIndex !== index.current &&
          event.state?.demoIndex !== undefined
        ) {
          restoring.current = true;
          history.go(index.current - nextIndex);
        } else
          history.replaceState(
            { demoIndex: index.current },
            "",
            "#" +
              routeRef.current.view +
              (routeRef.current.view === "drafts" ||
              routeRef.current.view === "review"
                ? "/" + routeRef.current.id
                : ""),
          );
      } else {
        index.current = nextIndex;
        adoptRef.current(location.hash);
      }
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current) event.preventDefault();
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("beforeunload", unload);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("beforeunload", unload);
    };
  }, []);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route.view, route.id]);
  function openModal(kind: "discard" | "reset" | "changes") {
    modalTrigger.current = document.activeElement as HTMLElement;
    if (kind === "changes") {
      noteDraft.current = selected.id;
      setNote("");
      setNoteError(null);
    }
    setModal(kind);
  }
  function closeModal() {
    setModal(null);
    pending.current = null;
  }
  function returnFocus() {
    if (focusMainAfterDialog.current) {
      focusMainAfterDialog.current = false;
      requestAnimationFrame(() =>
        heading.current?.focus({ preventScroll: true }),
      );
      return;
    }
    if (modalTrigger.current?.isConnected)
      modalTrigger.current.focus({ preventScroll: true });
    else heading.current?.focus({ preventScroll: true });
  }
  function routeTo(hash: string) {
    if (hash === location.hash) return;
    index.current++;
    history.pushState({ demoIndex: index.current }, "", hash);
    adopt(hash);
  }
  function intercept(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[href]",
    );
    if (
      !anchor ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const href = anchor.getAttribute("href")!;
    if (href.startsWith("#")) {
      event.preventDefault();
      if (href === location.hash) return;
      if (dirty) {
        pending.current = { hash: href };
        openModal("discard");
      } else routeTo(href);
    } else if (dirty && href.startsWith("https://")) {
      event.preventDefault();
      pending.current = { external: href };
      openModal("discard");
    }
  }
  function discard() {
    const target = pending.current;
    focusMainAfterDialog.current = true;
    dirtyRef.current = false;
    setBuffer(selected.caption);
    setModal(null);
    pending.current = null;
    if (!target) return;
    if ("external" in target) {
      location.assign(target.external);
      return;
    }
    if (target.index !== undefined && target.index !== index.current)
      history.go(target.index - index.current);
    else routeTo(target.hash);
  }
  function save() {
    const error = validateCaption(buffer);
    setCaptionError(error);
    if (error) return;
    if (buffer === selected.caption) {
      setAnnouncement("No changes to save.");
      return;
    }
    dispatch({ type: "save", id: selected.id, caption: buffer });
    setAnnouncement("Demo caption saved. Previous approval has been cleared.");
  }
  function submit() {
    if (dirty) {
      setCaptionError(
        "Save or discard your edits before sending for demo review.",
      );
      return;
    }
    dispatch({ type: "submit", id: selected.id });
    setAnnouncement(
      "Saved draft sent for demo review. No notification was sent.",
    );
  }
  function approve() {
    dispatch({ type: "approve", id: selected.id });
    setAnnouncement("Approved in demo. A sample handoff is now available.");
  }
  function saveNote() {
    if (
      noteDraft.current !== selected.id ||
      selected.status !== "needs-review"
    ) {
      closeModal();
      return;
    }
    const error = validateNote(note);
    setNoteError(error);
    if (error) return;
    dispatch({ type: "request-changes", id: selected.id, note });
    setAnnouncement("Demo changes requested. No notification was sent.");
    setModal(null);
  }
  function download(draft: Draft) {
    if (dirty) return;
    const handoff = makeHandoff(draft);
    const url = URL.createObjectURL(
      new Blob([handoff.text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = handoff.filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    dispatch({ type: "download", id: draft.id });
    setAnnouncement(
      "Sample text handoff downloaded to your device. Nothing was published.",
    );
  }
  function reset() {
    focusMainAfterDialog.current = true;
    dirtyRef.current = false;
    dispatch({ type: "reset" });
    setBuffer(createWorkspace().drafts[0]!.caption);
    setCaptionError(null);
    setNote("");
    setNoteError(null);
    pending.current = null;
    setModal(null);
    setAnnouncement(
      "Sample data reset. All demo changes and activity have been cleared.",
    );
    routeTo("#overview");
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  const label = views.find((v) => v.id === route.view)!.label;
  return (
    <div className="workspace-app" onClick={intercept}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          heading.current?.focus();
        }}
      >
        Skip to workspace content
      </a>
      <div className="concept-bar">
        <ShieldCheck size={15} aria-hidden="true" />
        <p>{conceptNotice}</p>
      </div>
      <div className="workspace-shell">
        <aside className="sidebar">
          <a
            href="#overview"
            className="brand"
            aria-label="Social Content Workspace overview"
          >
            <img src="/assets/krelyvo-logo.png" width={38} height={38} alt="" />
            <span>
              Krelyvo<span>Social Content Workspace</span>
            </span>
          </a>
          <div className="sidebar-label">Workspace concept</div>
          <nav aria-label="Workspace">
            {views.map((v) => {
              const Icon = navIcons[v.id];
              return (
                <a
                  key={v.id}
                  href={"#" + v.id}
                  aria-label={v.label}
                  aria-current={route.view === v.id ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{v.label}</span>
                  {v.id === "review" && (
                    <span className="nav-count" aria-label="Needs review">
                      {
                        state.drafts.filter((d) => d.status === "needs-review")
                          .length
                      }
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
          <div className="sidebar-bottom">
            <div className="demo-card">
              <span className="demo-dot" aria-hidden="true" />
              <strong>Explore without connecting</strong>
              <p>
                No accounts, keys or personal data. Just a clear example of the
                workflow.
              </p>
            </div>
            <a className="back-link" href="https://krelyvo.com/work">
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Krelyvo Work
            </a>
          </div>
        </aside>
        <div className="workspace-main">
          <header className="topbar">
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={14} aria-hidden="true" />
              <strong>{label}</strong>
            </div>
            <a
              href="https://krelyvo.com/contact?service=ai-agents-automation&offering=custom-agents"
              className="discuss-link"
            >
              Discuss a custom system{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </header>
          <main id="main-content">
            {route.view === "overview" && (
              <Overview state={state} headingRef={heading} />
            )}
            {route.view === "brief" && <Brief headingRef={heading} />}
            {route.view === "ideas" && (
              <Ideas drafts={state.drafts} headingRef={heading} />
            )}
            {route.view === "drafts" && (
              <DraftEditor
                draft={selected}
                drafts={state.drafts}
                headingRef={heading}
                buffer={buffer}
                change={(value) => {
                  setBuffer(value);
                  setCaptionError(null);
                }}
                error={captionError}
                dirty={dirty}
                save={save}
                submit={submit}
                download={() => download(selected)}
              />
            )}
            {route.view === "review" && (
              <Review
                draft={selected}
                drafts={state.drafts}
                headingRef={heading}
                approve={approve}
                requestChanges={() => openModal("changes")}
                download={() => download(selected)}
              />
            )}
            <footer className="workspace-footer">
              <span>A platform concept by Krelyvo Studio</span>
              <div>
                <span>Demo changes reset when you reload</span>
                <button
                  type="button"
                  className="reset-button"
                  onClick={() => openModal("reset")}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Reset demo
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
      <Modal
        open={modal === "discard"}
        title="Discard unsaved changes?"
        description="Your unsaved caption edits will be lost. Saved demo changes remain until you reset or reload."
        close={closeModal}
        returnFocus={returnFocus}
      >
        <div className="dialog-actions">
          <button className="button secondary" onClick={closeModal}>
            Keep editing
          </button>
          <button className="button primary" onClick={discard}>
            Discard
          </button>
        </div>
      </Modal>
      <Modal
        open={modal === "reset"}
        title="Reset this demo?"
        description="This clears saved edits, review decisions and activity, then restores the original fictional sample data."
        close={closeModal}
        returnFocus={returnFocus}
      >
        <div className="dialog-actions">
          <button className="button secondary" onClick={closeModal}>
            Keep exploring
          </button>
          <button className="button primary" onClick={reset}>
            Reset sample data
          </button>
        </div>
      </Modal>
      <Modal
        open={modal === "changes"}
        title="Request demo changes"
        description="Leave a clear note for this sample draft. This is a local demo action; nobody will be notified."
        close={closeModal}
        returnFocus={returnFocus}
        note
      >
        <label htmlFor="review-note" className="field-label">
          Review note
        </label>
        <textarea
          id="review-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteError(null);
          }}
          aria-invalid={!!noteError}
          aria-describedby={noteError ? "note-error" : "note-count"}
          rows={4}
        />
        <p id="note-count" className="field-meta">
          {note.length} / 500 characters
        </p>
        {noteError && (
          <p id="note-error" className="error" role="alert">
            {noteError}
          </p>
        )}
        <div className="dialog-actions">
          <button className="button secondary" onClick={closeModal}>
            Cancel
          </button>
          <button className="button primary" onClick={saveNote}>
            Save review note
          </button>
        </div>
      </Modal>
    </div>
  );
}
