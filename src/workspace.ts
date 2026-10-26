export type DraftStatus =
  "draft" | "needs-review" | "changes-requested" | "approved";
export type DraftId = "atmosphere" | "menu" | "gathering";
export type ViewId = "overview" | "brief" | "ideas" | "drafts" | "review";
export type Draft = {
  id: DraftId;
  campaignId: string;
  title: string;
  headline: string;
  caption: string;
  status: DraftStatus;
  note?: string;
  purpose: string;
  image: string;
  alt: string;
};
export type Workspace = {
  campaigns: { id: string; name: string }[];
  drafts: Draft[];
  activity: { id: number; message: string }[];
};
export type Action =
  | { type: "save"; id: string; caption: string }
  | { type: "request-changes"; id: string; note: string }
  | { type: "submit" | "approve" | "download"; id: string }
  | { type: "reset" };

export const conceptNotice =
  "Interactive concept by Krelyvo Studio. Fictional sample data; no live AI, account connection or publishing. Changes reset on reload.";
export const artworkNotice =
  "AI-generated concept imagery from the fictional Ember & Oak campaign.";
export const statusLabels: Record<DraftStatus, string> = {
  draft: "Draft",
  "needs-review": "Needs review",
  "changes-requested": "Changes requested",
  approved: "Approved in demo",
};
export const views: { id: ViewId; label: string; number: string }[] = [
  { id: "overview", label: "Overview", number: "01" },
  { id: "brief", label: "Brand & Brief", number: "02" },
  { id: "ideas", label: "Ideas", number: "03" },
  { id: "drafts", label: "Drafts", number: "04" },
  { id: "review", label: "Review", number: "05" },
];
export function createWorkspace(): Workspace {
  return {
    campaigns: [{ id: "ember-evening", name: "An evening, imagined" }],
    drafts: [
      {
        id: "atmosphere",
        campaignId: "ember-evening",
        title: "Atmosphere",
        headline: "Stay a little longer.",
        caption:
          "The feeling before the first plate. Warm light, thoughtful details and room for another conversation. An imagined evening at Ember & Oak.",
        status: "needs-review",
        purpose:
          "Introduce the warmth of an imagined evening, before the first plate arrives.",
        image: "post-01-atmosphere",
        alt: "An Ember & Oak concept post showing an imagined warm dining room above Stay a little longer.",
      },
      {
        id: "menu",
        campaignId: "ember-evening",
        title: "Menu direction",
        headline: "Seasonal plates. Shared moments.",
        caption:
          "Wild mushroom pappardelle, imagined for the Ember & Oak sample menu. A creative study in food, texture and the pleasure of sharing.",
        status: "changes-requested",
        note: "Keep the menu description clearly illustrative.",
        purpose:
          "Connect a fictional seasonal dish to an inviting, food-led creative direction.",
        image: "post-02-menu",
        alt: "Cream editorial concept post with a complete pasta bowl photograph and Seasonal plates. Shared moments.",
      },
      {
        id: "gathering",
        campaignId: "ember-evening",
        title: "Gathering",
        headline: "Make an evening of it.",
        caption:
          "A table set for conversation. The gathering is imagined; the creative direction connects the room, the menu and the invitation.",
        status: "approved",
        purpose:
          "Make the shared table the centre of a fictional restaurant story.",
        image: "post-03-gathering",
        alt: "Terracotta concept post with an imagined shared table and Make an evening of it.",
      },
    ],
    activity: [],
  };
}
export function validateCaption(text: string): string | null {
  if (!text.trim()) return "Add a caption before saving.";
  return text.length > 2000
    ? "Keep the caption to 2,000 characters or fewer."
    : null;
}
export function validateNote(text: string): string | null {
  if (!text.trim()) return "Add a note explaining what needs to change.";
  return text.length > 500
    ? "Keep the review note to 500 characters or fewer."
    : null;
}
export function getMetrics(state: Workspace) {
  return {
    campaigns: state.campaigns.length,
    drafts: state.drafts.length,
    needsReview: state.drafts.filter((d) => d.status === "needs-review").length,
    approved: state.drafts.filter((d) => d.status === "approved").length,
  };
}
export function workspaceReducer(state: Workspace, action: Action): Workspace {
  if (action.type === "reset") return createWorkspace();
  const draft = state.drafts.find((d) => d.id === action.id);
  if (!draft) return state;
  let next: Draft = draft;
  let message = "";
  switch (action.type) {
    case "save": {
      if (validateCaption(action.caption) || action.caption === draft.caption)
        return state;
      next = {
        ...draft,
        caption: action.caption,
        status: "draft",
        note: undefined,
      };
      message = "Caption saved · " + draft.title;
      break;
    }
    case "submit":
      if (draft.status !== "draft" && draft.status !== "changes-requested")
        return state;
      next = { ...draft, status: "needs-review" };
      message = "Sent for demo review · " + draft.title;
      break;
    case "approve":
      if (draft.status !== "needs-review") return state;
      next = { ...draft, status: "approved", note: undefined };
      message = "Approved in demo · " + draft.title;
      break;
    case "request-changes":
      if (draft.status !== "needs-review" || validateNote(action.note))
        return state;
      next = {
        ...draft,
        status: "changes-requested",
        note: action.note.trim(),
      };
      message = "Changes requested in demo · " + draft.title;
      break;
    case "download":
      if (draft.status !== "approved") return state;
      message = "Sample handoff downloaded · " + draft.title;
      break;
  }
  return {
    ...state,
    drafts:
      next === draft
        ? state.drafts
        : state.drafts.map((d) => (d.id === draft.id ? next : d)),
    activity: [
      { id: (state.activity[0]?.id ?? 0) + 1, message },
      ...state.activity,
    ],
  };
}
export function makeHandoff(draft: Draft): { filename: string; text: string } {
  if (draft.status !== "approved")
    throw new Error("Only approved demo drafts can be exported.");
  const slug =
    draft.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "draft";
  return {
    filename: "ember-oak-" + slug + "-sample.txt",
    text: [
      "Interactive concept by Krelyvo Studio",
      "Fictional sample content. No live AI, account connection or publishing.",
      "",
      "Brand: Ember & Oak — fictional restaurant concept",
      "Campaign: An evening, imagined",
      "Draft: " + draft.title,
      "Status: Approved in demo",
      "",
      "Caption:",
      draft.caption,
      "",
      "This sample handoff is not a published post or an actual client approval.",
      "",
    ].join("\n"),
  };
}
