import { describe, expect, test } from "bun:test";
import {
  createWorkspace,
  workspaceReducer as reduce,
  getMetrics,
  validateCaption,
  validateNote,
  makeHandoff,
} from "../src/workspace";

describe("fictional workspace state", () => {
  test("derives initial counts from three records and keeps changes requested separate", () => {
    const state = createWorkspace();
    expect(getMetrics(state)).toEqual({
      campaigns: 1,
      drafts: 3,
      needsReview: 1,
      approved: 1,
    });
    expect(state.activity).toHaveLength(0);
    expect(createWorkspace()).not.toBe(state);
  });
  test("validates blank, boundary and oversized captions and notes", () => {
    expect(validateCaption("  \n ")).toBeTruthy();
    expect(validateCaption("a".repeat(2000))).toBeNull();
    expect(validateCaption("a".repeat(2001))).toBeTruthy();
    expect(validateNote(" \n ")).toBeTruthy();
    expect(validateNote("a".repeat(500))).toBeNull();
    expect(validateNote("a".repeat(501))).toBeTruthy();
  });
  test("saving edits invalidates approval and review notes, while unchanged saves are no-ops", () => {
    const start = createWorkspace();
    const caption = start.drafts.find((d) => d.id === "gathering")!.caption;
    expect(reduce(start, { type: "save", id: "gathering", caption })).toBe(
      start,
    );
    const state = reduce(start, {
      type: "save",
      id: "gathering",
      caption: "<script>just text</script> — an imagined evening.",
    });
    expect(state.drafts.find((d) => d.id === "gathering")?.status).toBe(
      "draft",
    );
    expect(getMetrics(state).approved).toBe(0);
    expect(state.activity).toHaveLength(1);
    const cleared = reduce(start, {
      type: "save",
      id: "menu",
      caption: "A revised concept caption.",
    });
    expect(cleared.drafts.find((d) => d.id === "menu")?.note).toBeUndefined();
    expect(
      reduce(start, { type: "save", id: "gathering", caption: "  " }),
    ).toBe(start);
  });
  test("supports a review cycle, rejects invalid/stale transitions and preserves immutable seeds", () => {
    const start = createWorkspace();
    let state = reduce(start, {
      type: "request-changes",
      id: "atmosphere",
      note: "Make the concept status clearer.",
    });
    expect(state.drafts[0]!.status).toBe("changes-requested");
    expect(reduce(state, { type: "approve", id: "atmosphere" })).toBe(state);
    state = reduce(state, { type: "submit", id: "atmosphere" });
    expect(state.drafts[0]!.status).toBe("needs-review");
    state = reduce(state, { type: "approve", id: "atmosphere" });
    expect(getMetrics(state).approved).toBe(2);
    expect(state.drafts[0]!.note).toBeUndefined();
    expect(reduce(state, { type: "submit", id: "atmosphere" })).toBe(state);
    expect(
      reduce(state, { type: "request-changes", id: "atmosphere", note: "   " }),
    ).toBe(state);
    expect(reduce(start, { type: "approve", id: "missing" })).toBe(start);
    expect(start.drafts[0]!.status).toBe("needs-review");
    expect(reduce(state, { type: "reset" })).toEqual(start);
  });
  test("exports only approved saved captions, with safe filenames and explicit concept labels", () => {
    const state = createWorkspace();
    expect(() => makeHandoff(state.drafts[0]!)).toThrow("approved");
    const approved = state.drafts[2]!;
    const handoff = makeHandoff({
      ...approved,
      title: "../../a*bad:name",
      caption: "<img src=x> café 🌿",
    });
    expect(handoff.filename).toMatch(/^[a-z0-9-]+\.txt$/);
    expect(handoff.text).toContain("Interactive concept by Krelyvo Studio");
    expect(handoff.text).toContain("Approved in demo");
    expect(handoff.text).toContain("<img src=x> café 🌿");
    expect(handoff.text).toContain(
      "No live AI, account connection or publishing",
    );
    expect(reduce(state, { type: "download", id: "atmosphere" })).toBe(state);
    const downloaded = reduce(state, { type: "download", id: approved.id });
    expect(downloaded.drafts).toBe(state.drafts);
    expect(downloaded.activity[0]!.message).toContain(
      "Sample handoff downloaded",
    );
  });
});
