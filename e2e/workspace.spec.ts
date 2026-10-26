import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const demoBase = process.env["DEMO_BASE_URL"] || "http://127.0.0.1:8101";

test("disclosed sample overview has accurate counts and complete local artwork", async ({
  page,
}) => {
  const unexpected: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith(demoBase) &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("blob:")
    )
      unexpected.push(r.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A clear path from brief to approval." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Fictional sample data; no live AI, account connection or publishing.",
      { exact: false },
    ),
  ).toBeVisible();
  for (const [key, value] of Object.entries({
    campaigns: "1",
    drafts: "3",
    "needs-review": "1",
    approved: "1",
  }))
    await expect(page.getByTestId("metric-" + key)).toHaveText(value);
  await expect(page.getByText("No actions in this visit yet")).toBeVisible();
  await expect(page.locator("img[data-artwork]")).toHaveCount(1);
  await expect
    .poll(() =>
      page
        .locator("img[data-artwork]")
        .evaluateAll((imgs) =>
          imgs.every(
            (i) =>
              (i as HTMLImageElement).complete &&
              (i as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await expect(
    page.getByRole("link", { name: "Discuss a custom system" }),
  ).toHaveAttribute(
    "href",
    "https://krelyvo.com/contact?service=ai-agents-automation&offering=custom-agents",
  );
  expect(unexpected).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookies: "" });
  await page.screenshot({
    path: "test-results/overview-1440.png",
    fullPage: true,
  });
});

test("ideas select existing drafts; save invalidates approval and full review enables a local handoff", async ({
  page,
}) => {
  await page.goto("/#ideas");
  await expect(
    page.getByText("Prepared sample ideas — no AI request is made"),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Open sample draft: Gathering" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Gathering", exact: true }),
  ).toBeVisible();
  const caption = "An imagined gathering. <strong>Plain text</strong> — café.";
  await page.getByLabel("Caption").fill(caption);
  await page.getByRole("button", { name: "Save demo changes" }).click();
  await expect(page.getByTestId("draft-status")).toHaveText("Draft");
  await expect(
    page.getByRole("button", { name: "Download sample handoff" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Send for demo review" }).click();
  await expect(page.getByTestId("draft-status")).toHaveText("Needs review");
  await page.getByRole("link", { name: "Review", exact: true }).click();
  await page
    .getByRole("link", { name: "Review Gathering", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Approve in demo", exact: true })
    .click();
  await expect(page.getByTestId("review-status")).toHaveText(
    "Approved in demo",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download sample handoff" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ember-oak-gathering-sample.txt");
  const body = await readFile((await download.path())!, "utf8");
  expect(body).toContain(caption);
  expect(body).toContain("Approved in demo");
  expect(body).toContain("No live AI, account connection or publishing");
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page.getByTestId("metric-drafts")).toHaveText("3");
  await expect(
    page.getByText("Sample handoff downloaded · Gathering"),
  ).toBeVisible();
});

test("caption validation and discarded-navigation dialog protect unsaved edits, including Back", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ideas", exact: true }).click();
  await page
    .getByRole("link", { name: "Open sample draft: Atmosphere" })
    .click();
  await page.getByLabel("Caption").fill("  ");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  await expect(page.getByText("Add a caption before saving.")).toBeVisible();
  await page.getByLabel("Caption").fill("x".repeat(2001));
  await page.getByRole("button", { name: "Save demo changes" }).click();
  await expect(
    page.getByText("Keep the caption to 2,000 characters or fewer."),
  ).toBeVisible();
  await page.getByLabel("Caption").fill("Keep this unsaved caption.");
  await page.getByRole("link", { name: "Brand & Brief", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard unsaved changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing", exact: true }).click();
  await expect(page.getByLabel("Caption")).toHaveValue(
    "Keep this unsaved caption.",
  );
  await expect(
    page.getByRole("link", { name: "Brand & Brief", exact: true }),
  ).toBeFocused();
  await page.goBack();
  await expect(
    page.getByRole("dialog", { name: "Discard unsaved changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Discard", exact: true }).click();
  await expect(page).toHaveURL(/#ideas$/);
  await expect(
    page.getByRole("heading", { name: "A starting point for every post." }),
  ).toBeFocused();
});

test("review notes validate, approval respects states, and reset cancel/confirm/reload behave", async ({
  page,
}) => {
  await page.goto("/#review/atmosphere");
  await page
    .getByRole("button", { name: "Request changes", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Request demo changes" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save review note" }).click();
  await expect(
    page.getByText("Add a note explaining what needs to change."),
  ).toBeVisible();
  await page.getByLabel("Review note").fill("x".repeat(501));
  await page.getByRole("button", { name: "Save review note" }).click();
  await expect(
    page.getByText("Keep the review note to 500 characters or fewer."),
  ).toBeVisible();
  await page.getByLabel("Review note").fill("Mention this is imagined.");
  await page.getByRole("button", { name: "Save review note" }).click();
  await expect(page.getByTestId("review-status")).toHaveText(
    "Changes requested",
  );
  await expect(page.getByText("Mention this is imagined.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Approve in demo", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("review-status")).toHaveText(
    "Changes requested",
  );
  await expect(
    page.getByRole("button", { name: "Reset demo", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Reset sample data" }).click();
  await expect(page).toHaveURL(/#overview$/);
  await expect(page.getByText("No actions in this visit yet")).toBeVisible();
  await expect(page.getByTestId("metric-needs-review")).toHaveText("1");
  await page.goto("/#drafts/gathering");
  await page.getByLabel("Caption").fill("Temporary saved demo edit.");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  await page.reload();
  await expect(page.getByTestId("draft-status")).toHaveText("Approved in demo");
  await expect(page.getByLabel("Caption")).not.toHaveValue(
    "Temporary saved demo edit.",
  );
});

test("keyboard, reduced motion and all five views fit phone, tablet and desktop", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of [
      "overview",
      "brief",
      "ideas",
      "drafts/atmosphere",
      "review/atmosphere",
    ]) {
      await page.goto("/#" + view);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(
        page.getByRole("navigation", { name: "Workspace" }),
      ).toBeVisible();
    }
    if (width === 390) {
      await page.goto("/");
      await page.screenshot({
        path: "test-results/overview-390.png",
        fullPage: true,
      });
    }
  }
  await page.goto("/#review/atmosphere");
  await page
    .getByRole("button", { name: "Request changes", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Review note")).toBeFocused();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page
        .getByRole("dialog")
        .evaluate((d) => d.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Request changes", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: "test-results/review-1440.png",
    fullPage: true,
  });
  await page.goto("/#drafts/atmosphere");
  await page.screenshot({
    path: "test-results/drafts-1440.png",
    fullPage: true,
  });
});

test("no-JavaScript fallback is meaningful and search metadata discourages indexing", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(demoBase + "/");
  await expect(
    page.getByRole("heading", {
      name: "Social Content Workspace",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Interactive controls require JavaScript."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to Krelyvo Work" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow, noarchive",
  );
  await expect(page.getByRole("button")).toHaveCount(0);
  await context.close();
});
test("browser Back closes a review note before it can target another draft", async ({
  page,
}) => {
  await page.goto("/#drafts/menu");
  await page.getByRole("button", { name: "Send for demo review" }).click();
  await page.getByRole("link", { name: "Open in review", exact: true }).click();
  await page
    .getByRole("link", { name: "Review Atmosphere", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Request changes", exact: true })
    .click();
  await page.getByLabel("Review note").fill("Feedback for Atmosphere only.");
  await page.goBack();
  await expect(page).toHaveURL(/#review\/menu$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "A person makes the final call." }),
  ).toBeFocused();
  await expect(page.getByTestId("review-status")).toHaveText("Needs review");
  await expect(page.getByText("Feedback for Atmosphere only.")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Review Atmosphere", exact: true })
    .click();
  await expect(page.getByTestId("review-status")).toHaveText("Needs review");
  await page
    .getByRole("button", { name: "Request changes", exact: true })
    .click();
  await expect(page.getByLabel("Review note")).toHaveValue("");
});
